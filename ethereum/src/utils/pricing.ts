import { BigDecimal, BigInt } from '@graphprotocol/graph-ts'

import { exponentToBigDecimal, safeDiv } from '../utils/index'
import { Bundle, Pool, Token } from './../types/schema'
import { ONE_BD, ZERO_BD, ZERO_BI } from './constants'

export const WETH_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
export const USDC_WETH_03_POOL = '0x3cb2862653a2c3e2d248d313227f4b5a0e09e74a'
export const STABLECOIN_IS_TOKEN0 = false

// token where amounts should contribute to tracked volume and liquidity
// usually tokens that many tokens are paired with s
export const WHITELIST_TOKENS: string[] = [
  WETH_ADDRESS, // WETH
  '0xeeeeeb57642040be42185f49c52f7e9b38f8eeee', // ELK
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
  '0x111111111117dc0aa78b770fa6a738034120c302', // 1INCH
  '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9', // AAVE
  '0xff20817765cb7f73d4bde2e66e067e58d11095c2', // AMP
  '0xba100000625a3754423978a60c9317c58a424e3d', // BAL
  '0x0d8775f648430679a709e98d2b0cb6250d2887ef', // BAT
  '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c', // BNT
  '0xc00e94cb662c3520282e6f5717214004a7f26888', // COMP
  '0xd533a949740bb3306d119cc777fa900ba034cd52', // CRV
  '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
  '0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c', // ENJ
  '0xc944e90c64b2c07662a292be6244bdf05cda44a7', // GRT
  '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd', // GUSD
  '0x514910771af9ca656af840dff83e8264ecf986ca', // LINK
  '0xbbbbca6a901c926f240b89eacb641d8aec7aeafd', // LRC
  '0x0f5d2fb29fb7d3cfee444a200298f468908cc942', // MANA
  '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2', // MKR
  '0x4575f41308ec1483f3d399aa9a2826d74da13deb', // OXT
  '0x45804880de22913dafe09f4980848ece6ecbaf78', // PAXG
  '0x408e41876cccdc0f92210600ef50372656052a38', // REN
  '0x3845badade8e6dff049820680d1f14bd3903a5d0', // SAND
  '0x00c83aecc790e8a4453e5dd3b0b4b3680501a7a7', // SKL
  '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f', // SNX
  '0xb64ef51c888972c908cfacf59b47c1afbc0ab8ac', // STORJ
  '0x04fa0d235c4abf4bcf4787af4cf447de572ef828', // UMA
  '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', // UNI
  '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e', // YFI
  '0xe41d2489571d322189246dafa5ebde1f4699f498', // ZRX
  '0xa283aa7cfbb27ef0cfbcb2493dd9f4330e0fd304', // MM
  '0xb753428af26e81097e7fd17f40c88aaa3e04902c', // SFI
  '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
  '0x7a5d3a9dcd33cb8d527f7b5f96eb4fef43d55636', // RADIO
  '0x491604c0fdf08347dd1fa4ee062a822a5dd06b5d', // CTSI
  '0x8d6cebd76f18e1558d4db88138e2defb3909fad6', // MAI
  '0x1a7e4e63778b4f12a199c062f3efdd288afcbce8', // agEUR
  '0x5a98fcbea516cf06857215779fd812ca3bef1b32', // LDO
  '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0', // WstETH
  '0xae7ab96520de3a18e5e111b5eaab095312d7fe84', // stETH
  '0xdefa4e8a7bcba345f687a2f1456f5edd9ce97202', // KNC
  '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0', // MATIC
  '0x0000000000085d4780b73119b644ae5ecd22b376', // TUSD
  '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', // WBTC
  '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643', // cDAI
  '0x39aa39c021dfbae8fac545936693ac917d5e7563', // cUSDC
  '0x86fadb80d8d2cff3c3680819e4da99c10232ba0f', // EBASE
  '0x57ab1ec28d129707052df4df418d58a2d46d5f51', // sUSD
  '0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8', // yCurv
  '0x956f47f50a910163d8bf957cf5846d573e7f87ca', // FEI
  '0xfe2e637202056d30016725477c5da089ab0a043a', // sETH2
]

export const STABLE_COINS: string[] = [
  '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
  '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
  '0x0000000000085d4780b73119b644ae5ecd22b376', // TUSD
  '0x956f47f50a910163d8bf957cf5846d573e7f87ca', // FEI
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
