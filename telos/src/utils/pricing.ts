import { BigDecimal, BigInt } from '@graphprotocol/graph-ts'

import { exponentToBigDecimal, safeDiv } from '../utils/index'
import { Bundle, Pool, Token } from './../types/schema'
import { ONE_BD, ZERO_BD, ZERO_BI } from './constants'

export const WETH_ADDRESS = '0xD102cE6A4dB07D247fcc28F366A623Df0938CA9E'
export const USDC_WETH_03_POOL = '0x3f13ba91be650ed78757aeaf7a69315f8f786646'
export const STABLECOIN_IS_TOKEN0 = true

// token where amounts should contribute to tracked volume and liquidity
// usually tokens that many tokens are paired with s
export const WHITELIST_TOKENS: string[] = [
  WETH_ADDRESS, // WETH
  '0x8d97cea50351fb4329d591682b148d43a0c3611b', // USDC
  '0xeeeeeb57642040be42185f49c52f7e9b38f8eeee', // elk
  '0xe1c110e1b1b4a1ded0caf3e42bfbdbb7b5d7ce1c', // old_elk
  '0xe1c8f3d529bea8e3fa1fac5b416335a2f998ee1c', // elk_legacy
]

export const STABLE_COINS: string[] = [
  '0x8d97cea50351fb4329d591682b148d43a0c3611b', // USDC
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
