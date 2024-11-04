import { BigDecimal, BigInt } from '@graphprotocol/graph-ts'

import { exponentToBigDecimal, safeDiv } from '../utils/index'
import { Bundle, Pool, Token } from './../types/schema'
import { ONE_BD, ZERO_BD, ZERO_BI } from './constants'

export const WETH_ADDRESS = '0x0be9e53fd7edac9f859882afdda116645287c629'
export const USDC_WETH_03_POOL = '0xca4a3dacddf33d83c8d43b1152d0c8aadbc88b8b'
export const STABLECOIN_IS_TOKEN0 = false

// token where amounts should contribute to tracked volume and liquidity
// usually tokens that many tokens are paired with s
export const WHITELIST_TOKENS: string[] = [
  WETH_ADDRESS, // WFUSDV3
  '0xeeeeeb57642040be42185f49c52f7e9b38f8eeee', // ELK
  '0xe1c110e1b1b4a1ded0caf3e42bfbdbb7b5d7ce1c', // oELK
  '0x6acb34b1df86e254b544189ec32cf737e2482058', // WBNB
  '0x94ba7a27c7a95863d1bdc7645ac2951e0cca06ba', // DAI
  '0x2f60a843302f1be3fa87429ca9d684f9091b003c', // DEXT
  '0xce86a1cf3cff48139598de6bf9b1df2e0f79f86f', // fUSDv3
  '0x495d133b938596c9984d462f007b676bdc57ecec', // G$
  '0x025a4c577198d116ea499193e6d735fdb2e6e841', // GRT
  '0x43b17749b246fd2a96de25d9e4184e27e09765b0', // KNC
  '0x0972f26e8943679b043de23df2fd3852177a7c48', // WLINK
  '0x7f59ae3a787c0d1d640f99883d0e48c22188c54f', // OM
  '0x620fd5fa44be6af63715ef4e65ddfa0387ad13f5', // USDC
  '0xfadbbf8ce7d5b7041be672561bba99f79c532e10', // USDT
  '0x33284f95ccb7b948d9d352e1439561cf83d8d00d', // WBTC
  '0xa722c13135930332eb3d749b2f0906559d2c5b99', // WETH
  '0x0be9e53fd7edac9f859882afdda116645287c629', // WFUSE
  '0xebb82851b8e1348cc774442735b710b4cd105210', // fDoge
  '0x90708b20ccc1eb95a4fa7c8b18fd2c22a0ff9e78', // SUSHI
  '0x7ec73806f81b4044d64416468c4b05688f38e365', // DELTA
  '0xfe4d5e383beaa6d2357ce7ba9883019b760ad134', // tGod
  '0x427c995a0623157a3c1c6b8b86410b5b3a26061b', // GRIM
  '0x42e44f16d2183d7ed27c501b04f29084ef4c2d24', // ISWT
  '0x4e69ae0cd024754655b4ef74f24a8dcb39ba07e8', // CEUS
  '0x2dfdab3253051f6857580d9a360c531cbf40eb4d', // DMK
  '0x6d2a05948ed279f8a0ca532fc1a2a7767300c46e', // DC
  '0x74616164eb1892cec5fa553d45b3e5d6df7bc7b9', // FOO
]

export const STABLE_COINS: string[] = [
  '0xce86a1cf3cff48139598de6bf9b1df2e0f79f86f', // fUSDv3
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
