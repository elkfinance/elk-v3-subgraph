import { BigDecimal, BigInt } from '@graphprotocol/graph-ts'

import { exponentToBigDecimal, safeDiv } from '../utils/index'
import { Bundle, Pool, Token } from './../types/schema'
import { ONE_BD, ZERO_BD, ZERO_BI } from './constants'

export const WETH_ADDRESS = '0xa00744882684c3e4747faefd68d283ea44099d03'
export const USDC_WETH_03_POOL = '0x83c37516849c25b21d21609210b53e2b16415b7d'
export const STABLECOIN_IS_TOKEN0 = true

// token where amounts should contribute to tracked volume and liquidity
// usually tokens that many tokens are paired with s
export const WHITELIST_TOKENS: string[] = [
  WETH_ADDRESS, // WETH
  '0xeeeeeb57642040be42185f49c52f7e9b38f8eeee', // ELK
  '0xe1ce1c0fa22ec693baca6f5076bcdc4d0183de1c', // oELK
  '0xb8744ae4032be5e5ef9fab94ee9c3bf38d5d2ae0', // VITA
  '0x0258866edaf84d6081df17660357ab20a07d0c80', // ioETH
  '0x2a6003e4b618ff3457a4a2080d028b0249b51c80', // PAXG
  '0xacee9b11cd4b3f57e58880277ac72c8c41abe4e4', // BUSD
  '0xc7b93720f73b037394ce00f954f849ed484a3dea', // WBTC
  '0xedeefaca6a1581fe2349cdfc3083d4efa8188e55', // UNI
  '0x4752456e00def6025c77b55a88a2f8a1701f92f9', // METX
  '0x888a47d81844376cbde6737bfc702a10a2175f97', // SDI
  '0x4d7b88403aa2f502bf289584160db01ca442426c', // CYC
  '0x17df9fbfc1cdab0f90eddc318c4f6fcada730cf2', // GFT
  '0x84abcb2832be606341a50128aeb1db43aa017449', // BUSDb
  '0xa00744882684c3e4747faefd68d283ea44099d03', // WIOTX
  '0x9178f4ec8a7ff6fe08e848eeac3ddbe1a5fac70d', // UP
  '0x97e6c48867fdc391a8dfe9d169ecd005d1d90283', // WBNB
  '0x8e66c0d6b70c0b23d39f4b21a1eac52bba8ed89a', // WMATIC
  '0x62a9d987cbf4c45a550deed5b57b200d7a319632', // DAIm
  '0x3cdb7c48e70b854ed2fa392e21687501d84b3afc', // USDTm
  '0x5d0f4ca481fd725c9bc6b415c0ce5b3c3bd726cf', // GFS
  '0x99b2b0efb56e62e36960c20cd5ca8ec6abd5557a', // CIOTX
  '0x490cfbf9b9c43633ddd1968d062996227ef438a9', // iMAGIC
  '0x6fbcdc1169b5130c59e72e51ed68a84841c98cd1', // USDT
  '0x3b2bf2b523f54c4e454f08aa286d03115aff326c', // USDC
  '0x1cbad85aa66ff3c12dc84c5881886eeb29c1bb9b', // DAI
  '0x86702a7f8898b172de396eb304d7d81207127915', // ZOOM
  '0x32085b8ea854529178bd0f4e92d3fd2475a3a159', // FILDA
]

export const STABLE_COINS: string[] = [
  '0x6fbcdc1169b5130c59e72e51ed68a84841c98cd1', // USDT
  '0x3b2bf2b523f54c4e454f08aa286d03115aff326c', // USDC
  '0x1cbad85aa66ff3c12dc84c5881886eeb29c1bb9b', // DAI
  '0xcdf79194c6c285077a58da47641d4dbe51f63542', // USDC.e
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
