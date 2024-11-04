import { BigDecimal, BigInt } from '@graphprotocol/graph-ts'

import { exponentToBigDecimal, safeDiv } from '../utils/index'
import { Bundle, Pool, Token } from './../types/schema'
import { ONE_BD, ZERO_BD, ZERO_BI } from './constants'

export const WETH_ADDRESS = '0xcf664087a5bb0237a0bad6742852ec6c8d69a27a'
export const USDC_WETH_03_POOL = '0xfb02f6851db15a490b67a63374a6e20202716732'
export const STABLECOIN_IS_TOKEN0 = true

// token where amounts should contribute to tracked volume and liquidity
// usually tokens that many tokens are paired with s
export const WHITELIST_TOKENS: string[] = [
  WETH_ADDRESS, // WETH
  '0xeeeeeb57642040be42185f49c52f7e9b38f8eeee', // ELK
  '0xe1c110e1b1b4a1ded0caf3e42bfbdbb7b5d7ce1c', // oELK
  '0x58f1b044d8308812881a1433d9bbeff99975e70c', // 1INCH
  '0xcf323aad9e522b93f11c352caa519ad0e14eb40f', // AAVE
  '0xdc5f76104d0b8d2bf2c2bbe06cdfe17004e9010f', // BAL
  '0x32137b9275ea35162812883582623cd6f6950958', // COMP
  '0x5c99f47e749d2fb9f6002a2945df5ea3f7162dfe', // CREAM
  '0x352cd428efd6f31b5cae636928b7b84149cf369f', // CRV
  '0x34704c70e9ec9fb9a921da6daad7d3e19f43c734', // DSLA
  '0x301259f392b551ca8c592c9f676fcd2f9a0a84c5', // MATIC
  '0x7b9c523d59aefd362247bd5601a89722e3774dd2', // SNX
  '0xbec775cb42abfa4288de81f387a9b1a3c4bc552a', // SUSHI
  '0x50ae1aba372b836523c982d8ce88e89aa8a92863', // TEL
  '0x90d81749da8867962c760414c1c25ec926e889b6', // UNI
  '0x9a89d0e1b051640c6704dde4df881f73adfef39a', // bscUSDT
  '0xe7e3c4d1cfc722b45a428736845b6aff862842a1', // WISE
  '0xa7a22299918828d791240f9ec310c2e066592053', // xSUSHI
  '0xa0dc05f84a27fccbd341305839019ab86576bc07', // YFI
  '0x2f459dd7cbcc9d8323621f6fb430cd0555411e7b', // JENN
  '0x218532a12a389a4a92fc0c5fb22901d1c19198aa', // LINK
  '0x95ce547d730519a90def30d647f37d9e5359b6ae', // LUNA
  '0x224e64ec1bdce3870a6a6c777edd450454068fec', // UST
  '0xb8e0497018c991e86311b64efd9d57b06aedbbae', // VINCI
  '0xea589e93ff18b1a1f1e9bac7ef3e86ab62addc79', // VIPER
  '0xcf664087a5bb0237a0bad6742852ec6c8d69a27a', // WONE
  '0xe064a68994e9380250cfee3e8c0e2ac5c0924548', // xVIPER
  '0x3f56e0c36d275367b8c502090edf38289b3dea0d', // MAI
]

export const STABLE_COINS: string[] = [
  '0x9a89d0e1b051640c6704dde4df881f73adfef39a', //bscUSDT
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
