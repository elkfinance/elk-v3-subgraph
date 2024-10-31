import { BigDecimal, BigInt } from '@graphprotocol/graph-ts'

import { exponentToBigDecimal, safeDiv } from '../utils/index'
import { Bundle, Pool, Token } from './../types/schema'
import { ONE_BD, ZERO_BD, ZERO_BI } from './constants'

export const WETH_ADDRESS = '0x8f8526dbfd6e38e3d8307702ca8469bae6c56c15'
export const USDC_WETH_03_POOL = '0x21e6551e6c89c10c2a971c3536932b328931d84c'
export const STABLECOIN_IS_TOKEN0 = true

// token where amounts should contribute to tracked volume and liquidity
// usually tokens that many tokens are paired with s
export const WHITELIST_TOKENS: string[] = [
  WETH_ADDRESS, // WETH
  '0x332730a4f6e03d9c55829435f10360e13cfa41ff', // BUSD
  '0x382bb369d343125bfb2117af9c149795c6c65c50', // USDT
  '0xc946daf81b08146b1c7a8da2a851ddf2b3eaaf85', // USDC
  '0xeeeeeb57642040be42185f49c52f7e9b38f8eeee', // ELK
  '0xe1c110e1b1b4a1ded0caf3e42bfbdbb7b5d7ce1c', // oELK
  '0xdcac52e001f5bd413aa6ea83956438f29098166b', // USDK
  '0x8eac9d49f71a9393ed38a619038e880c86d5745c', // PND
  '0xdf54b6c6195ea4d948d03bfd818d365cf175cfc2', // OKB
  '0x54e4622dc504176b3bb432dccaf504569699a7ff', // BTCK
  '0xef71ca2ee68f45b9ad6f72fbdb33d707b872315c', // ETHK
  '0x8f8526dbfd6e38e3d8307702ca8469bae6c56c15', // WOKT
  '0xabc732f6f69a519f6d508434481376b6221eb7d5', // DOTK
  '0x3f8969be2fc0770dcc174968e4b4ff146e0acdaf', // FILK
  '0xfa520efc34c81bfc1e3dd48b7fe9ff326049f986', // LTCK
  '0x18d103b7066aeedb6005b78a462ef9027329b1ea', // BCHK
  '0x00505505a7576d6734704fabb16f41924e3e384b', // TRXK
  '0xaa27badaa3c9ec9081b8f6c9cdd2bf375f143780', // SHIBK
  '0x218c3c3d49d0e7b37aff0d8bb079de36ae61a4c0', // WBNB
  '0x79b627bc95fa5b36eca53eb39c3cdf43aafdd10f', // ORG
  '0x97513e975a7fa9072c72c92d8000b0db90b163c5', // BabyDoge
  '0xc3bdfee6186849d5509601045af4af567a001c94', // Glory
  '0x6b7a87899490ece95443e979ca9485cbe7e71522', // HERO
  '0x748def2e7fbb37111761aa78260b0ce71e41d4ca', // COCO
  '0x03d1e72765545729a035e909edd9371a405f77fb', // nHUSD
  '0xacd7b3d9c10e97d0efa418903c0c7669e702e4c0', // ELE
  '0x02f093513b7872cdfc518e51ed67f88f0e469592', // OKFly
  '0x5ab622494ab7c5e81911558c9552dbd517f403fb', // CELT
  '0xa07403c1bd0c5cf53df07f15faa589241352527b', // BLADE
]

export const STABLE_COINS: string[] = [
  '0x332730a4f6e03d9c55829435f10360e13cfa41ff', // BUSD
  '0x382bb369d343125bfb2117af9c149795c6c65c50', // USDT
  '0xc946daf81b08146b1c7a8da2a851ddf2b3eaaf85', // USDC
]

export const MINIMUM_ETH_LOCKED = BigDecimal.fromString('60')

const Q192 = BigInt.fromI32(2).pow(192 as u8)
export function sqrtPriceX96ToTokenPrices(sqrtPriceX96: BigInt, token0: Token, token1: Token): BigDecimal[] {
  const num = sqrtPriceX96.times(sqrtPriceX96).toBigDecimal()
  const denom = BigDecimal.fromString(Q192.toString())
  const price1 = num.div(denom).times(exponentToBigDecimal(token0.decimals)).div(exponentToBigDecimal(token1.decimals))

  const price0 = safeDiv(BigDecimal.fromString('1'), price1)
  return [price0, price1]
}

export function getNativePriceInUSD(
  stablecoinWrappedNativePoolAddress: string,
  stablecoinIsToken0: boolean,
): BigDecimal {
  const stablecoinWrappedNativePool = Pool.load(stablecoinWrappedNativePoolAddress)
  if (stablecoinWrappedNativePool !== null) {
    return stablecoinIsToken0 ? stablecoinWrappedNativePool.token0Price : stablecoinWrappedNativePool.token1Price
  } else {
    return ZERO_BD
  }
}

/**
 * Search through graph to find derived Eth per token.
 * @todo update to be derived ETH (add stablecoin estimates)
 **/
export function findNativePerToken(
  token: Token,
  wrappedNativeAddress: string,
  stablecoinAddresses: string[],
  minimumNativeLocked: BigDecimal,
): BigDecimal {
  if (token.id == wrappedNativeAddress) {
    return ONE_BD
  }
  const whiteList = token.whitelistPools
  // for now just take USD from pool with greatest TVL
  // need to update this to actually detect best rate based on liquidity distribution
  let largestLiquidityETH = ZERO_BD
  let priceSoFar = ZERO_BD
  const bundle = Bundle.load('1')!

  // hardcoded fix for incorrect rates
  // if whitelist includes token - get the safe price
  if (stablecoinAddresses.includes(token.id)) {
    priceSoFar = safeDiv(ONE_BD, bundle.ethPriceUSD)
  } else {
    for (let i = 0; i < whiteList.length; ++i) {
      const poolAddress = whiteList[i]
      const pool = Pool.load(poolAddress)

      if (pool) {
        if (pool.liquidity.gt(ZERO_BI)) {
          if (pool.token0 == token.id) {
            // whitelist token is token1
            const token1 = Token.load(pool.token1)
            // get the derived ETH in pool
            if (token1) {
              const ethLocked = pool.totalValueLockedToken1.times(token1.derivedETH)
              if (ethLocked.gt(largestLiquidityETH) && ethLocked.gt(minimumNativeLocked)) {
                largestLiquidityETH = ethLocked
                // token1 per our token * Eth per token1
                priceSoFar = pool.token1Price.times(token1.derivedETH as BigDecimal)
              }
            }
          }
          if (pool.token1 == token.id) {
            const token0 = Token.load(pool.token0)
            // get the derived ETH in pool
            if (token0) {
              const ethLocked = pool.totalValueLockedToken0.times(token0.derivedETH)
              if (ethLocked.gt(largestLiquidityETH) && ethLocked.gt(minimumNativeLocked)) {
                largestLiquidityETH = ethLocked
                // token0 per our token * ETH per token0
                priceSoFar = pool.token0Price.times(token0.derivedETH as BigDecimal)
              }
            }
          }
        }
      }
    }
  }
  return priceSoFar // nothing was found return 0
}

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD * 2.
 * If both are, return sum of two amounts
 * If neither is, return 0
 */
export function getTrackedAmountUSD(
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token,
  whitelistTokens: string[],
): BigDecimal {
  const bundle = Bundle.load('1')!
  const price0USD = token0.derivedETH.times(bundle.ethPriceUSD)
  const price1USD = token1.derivedETH.times(bundle.ethPriceUSD)

  // both are whitelist tokens, return sum of both amounts
  if (whitelistTokens.includes(token0.id) && whitelistTokens.includes(token1.id)) {
    return tokenAmount0.times(price0USD).plus(tokenAmount1.times(price1USD))
  }

  // take double value of the whitelisted token amount
  if (whitelistTokens.includes(token0.id) && !whitelistTokens.includes(token1.id)) {
    return tokenAmount0.times(price0USD).times(BigDecimal.fromString('2'))
  }

  // take double value of the whitelisted token amount
  if (!whitelistTokens.includes(token0.id) && whitelistTokens.includes(token1.id)) {
    return tokenAmount1.times(price1USD).times(BigDecimal.fromString('2'))
  }

  // neither token is on white list, tracked amount is 0
  return ZERO_BD
}
