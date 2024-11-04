import { BigDecimal, BigInt } from '@graphprotocol/graph-ts'

import { exponentToBigDecimal, safeDiv } from '../utils/index'
import { Bundle, Pool, Token } from './../types/schema'
import { ONE_BD, ZERO_BD, ZERO_BI } from './constants'

export const WETH_ADDRESS = '0x82af49447d8a07e3bd95bd0d56f35241523fbab1'
export const USDC_WETH_03_POOL = '0x199c3bf79a0e7c02ab21d3ec74913e63dbb44c60'
export const STABLECOIN_IS_TOKEN0 = false

// token where amounts should contribute to tracked volume and liquidity
// usually tokens that many tokens are paired with s
export const WHITELIST_TOKENS: string[] = [
  WETH_ADDRESS, // WETH
  '0xeeeeeb57642040be42185f49c52f7e9b38f8eeee', // ELK
  '0x7cb16cb78ea464ad35c8a50abf95dff3c9e09d5d', // 0xBTC
  '0x03b95f1c84af0607afd5dd87ca1fde7572aa827f', // AGVE
  '0x0e15258734300290a651fdbae8deb039a8e7a2fa', // ALCH
  '0xea986d33ef8a20a96120ecc44dbdd49830192043', // AUC
  '0x6f67043201c903bbcbc129750cb3b328dd56a0a5', // BAC
  '0xbfa641051ba0a0ad1b0acf549a89536a0d76472e', // BADGER
  '0x040d1edc9569d4bab2d15287dc5a4f10f56a56b8', // BAL
  '0xbbfbde08bf1be235a3fa97d6a27fffa19ac4a8a8', // BARK
  '0xa5ec9d64b64b8b9e94feaa7538c084b38117e7ba', // BLANK
  '0x0d81e50bc677fa67341c44d7eaa9228dee64a4e1', // BOND
  '0xba9a5dd807c9f072850be15a52df3408ba25fd18', // BTU
  '0x031d35296154279dc1984dcd93e392b1f946737b', // CAP
  '0x3a8b787f78d775aecfeea15706d4221b40f345ab', // CELR
  '0x989d099d29f62b839c8cbd41c82c6554a5515752', // CNT
  '0x354a6da3fcde098f8389cad84b0182725c6c91de', // COMP
  '0x6fe14d3cc2f7bddffba5cdb3bbe7467dd81ea101', // COTI
  '0xf4d48ce3ee1ac3651998971541badbb9a14d7234', // CREAM
  '0x11cdb42b0eb46d95f990bedd4695a6e3fa034978', // CRV
  '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', // DAI
  '0xdeba25af35e4097146d7629055e0ec3c71706324', // DEFI5
  '0xae6e3540e97b0b9ea8797b157b510e133afb6282', // DEGEN
  '0xae6aab43c4f3e0cea4ab83752c278f8debaba689', // DF
  '0x1d54aa7e322e02a0453c0f2fa21505ce7f2e9e93', // DFYN
  '0x8038f3c971414fd1fc220ba727f2d4a0fc98cb65', // DHT
  '0x69eb4fa4a2fbd498c257c57ea8b7655a2559a581', // DODO
  '0x4425742f1ec8d98779690b5a3a6276db85ddc01a', // DOG
  '0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55', // DPX
  '0xe212f5e733257ed5628a2febcedbc9222e535f51', // DSU
  '0xa7aa2921618e3d63da433829d448b58c9445a4c3', // DVF
  '0xc3ae0333f0f34aa734d5493276223d95b8f9cb37', // DXD
  '0xce32aa8d60807182c0003ef9cc1976fa10e5d312', // ESS
  '0x969131d8ddc06c2be11a13e6e7facf22cf57d95e', // EUX
  '0x3816e40c1eb106c8fb7c05f901cfd58c7292d051', // FOR
  '0x488cc08935458403a0458e45e20c0159c8ab2c92', // FST
  '0xbdef0e9ef12e689f366fe494a7a7d0dad25d9286', // FUSE
  '0x590020b1005b8b25f1a2c82c5f743c540dcfa24d', // GMX
  '0xa0b862f60edef4452f25b4160f177db44deb6cf1', // GNO
  '0x07e49d5de43dda6162fa28d24d5935c151875283', // GOVI
  '0x23a941036ae778ac51ab04cea08ed6e2fe103614', // GRT
  '0x9c67ee39e3c4954396b9142010653f17257dd39c', // IMX
  '0x04cb2d263a7489f02d813eaab9ba1bb8466347f2', // KUN
  '0x3cd1833ce959e087d0ef0cb45ed06bffe60f23ba', // LAND
  '0xf97f4df75117a78c1a5a0dbb814af92458539fb4', // WLINK
  '0x46d0ce7de6247b0a95f67b43b589b4041bae7fbe', // LRC
  '0x539bde0d7dbd336b79148aa742883198bbf60342', // MAGIC
  '0xaa086809efa469631dd90d8c6cb267bab107e958', // MAL
  '0x99f40b01ba9c469193b360f72740e416b17ac332', // MATH
  '0xaaa62d9584cbe8e4d68a43ec91bff4ff1fadb202', // MATTER
  '0x4e352cf164e64adcbad318c3a1e222e9eba4ce42', // MCB
  '0x2e9a6df78e42a30712c10a9dc4b1c8656f8f2879', // MKR
  '0x5298ee77a8f9e226898403ebac33e68a62f770a0', // MTA
  '0xb965029343d55189c25a7f3e0c9394dc0f5d41b1', // NDX
  '0xd67d9f7e018b4e7613b0251bbe3ba3988baf7c16', // NEC
  '0xc9c2b86cd4cdbab70cd65d22eb044574c3539f6c', // NFD
  '0x52f5d9b3a2bb89d3aec5829a3415c21115acd633', // OCTO
  '0x6e6a3d8f1affac703b1aef1f43b8d2321be40043', // OHM
  '0x55704a0e9e2eb59e176c5b69655dbd3dcdcfc0f0', // OVR
  '0x965772e0e9c84b6f359c8597c891108dcf1c5b1a', // PICKLE
  '0x3642c0680329ae3e103e2b5ab29ddfed4d43cbe5', // PL2
  '0x51fc0f6660482ea73330e414efd7808811a57fa2', // PREMIA
  '0xaef5bbcbfa438519a5ea80b4c7181b4e78d419f2', // RAI
  '0x32eb7902d4134bf98a28b963d26de779af92a212', // RDPX
  '0xef888bca6ab6b1d26dbec977c455388ecd794794', // RGT
  '0x5298060a95205be6dd4abc21910a4bb23d6dcd8b', // ROUTE
  '0x552e4e96a0ce6d36d161b63984848c8dac471ea2', // SAKE
  '0x7ba4a00d54a07461d9db2aef539e91409943adc9', // SDT
  '0xe5a5efe7ec8cdfa5f031d5159839a3b5e11b2e0f', // SPA
  '0x3e6648c5a70a150a88bce65f4ad4d506fe15d2af', // SPELL
  '0x326c33fd1113c1f29b35b4407f3d6312a8518431', // STRP
  '0x20f9628a485ebcc566622314f6e07e7ee61ff332', // SUM
  '0xd4d42f0b6def4ce0383636770ef773390d85c61a', // WSUSHI
  '0xde903e2712288a1da82942dddf2c20529565ac30', // SWPR
  '0xfa51b42d4c9ea35f1758828226aaedbec50dd54e', // TAC
  '0xa72159fc390f0e3c6d415e658264c7c4051e9b87', // TCR
  '0x4d15a3a2286d883af0aa1b3f21367843fac63e07', // TUSD
  '0x2ad62674a64e698c24831faf824973c360430140', // UBT
  '0xd5d3aa404d7562d09a848f96a8a8d5d65977bf90', // UDT
  '0xfa7f8980b0f1e64a2062791cc3b0871572f1f7f0', // UNI
  '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', // USDC.e
  '0xaf88d065e77c8cc2239327c5edb3a432268e5831', // USDC
  '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9', // USDT
  '0xcd14c3a2ba27819b352aae73414a26e2b366dc50', // USX
  '0x995c235521820f2637303ca1970c7c044583df44', // VISR
  '0x2ed14d1788dfb780fd216706096aed018514eccd', // VOX
  '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f', // WBTC
  '0xa64ecce74f8cdb7a940766b71f1b108bac69851a', // WCHI
  '0x82af49447d8a07e3bd95bd0d56f35241523fbab1', // WETH
  '0xcafcd85d8ca7ad1e1c6f82f651fa15e33aefd07b', // WOO
  '0xf0a5717ec0883ee56438932b0fe4a20822735fba', // XTK
  '0x82e3a8f066a6989666b031d916c43672085b1582', // YFI
  '0x0f61b24272af65eacf6adfe507028957698e032f', // ZIPT
  '0x4f947b40beeb9d8130437781a560e5c7d089730f', // kUSDC
  '0xa970af1a584579b618be4d69ad6f73459d112f95', // sUSD
  '0x319f865b287fcc10b30d8ce6144e8b6d1b476999', // CTSI
  '0x3f56e0c36d275367b8c502090edf38289b3dea0d', // MAI
  '0xfa5ed56a203466cbbc2430a43c66b9d8723528e7', // agEUR
  '0xe4dddfe67e7164b0fe14e218d80dc4c08edc01cb', // KNC
  '0xd85e038593d7a098614721eae955ec2022b9b91b', // gDAI
  '0x912ce59144191c1204e64559fe8253a0e49e6548', // ARB
  '0xaed882f117b78034829e2cffa11206706837b1b1', // WQ
]

export const STABLE_COINS: string[] = [
  '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', // USDC.e
  '0xaf88d065e77c8cc2239327c5edb3a432268e5831', // USDC
  '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9', // USDT
  '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', // DAI
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
