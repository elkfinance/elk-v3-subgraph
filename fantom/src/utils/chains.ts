import { Address, BigDecimal, BigInt, dataSource } from '@graphprotocol/graph-ts'

import { OPTIMISM_POOL_MAPPINGS } from '../backfill/poolMappings'
import { StaticTokenDefinition } from './staticTokenDefinition'

export enum ChainId {
  FANTOM = 250,
}

// subgraph does not support string enums, hence these constants

const FANTOM_NETWORK_NAME = 'fantom'

// Note: All token and pool addresses should be lowercased!
export class SubgraphConfig {
  // deployment address
  // e.g. https://docs.uniswap.org/contracts/v3/reference/deployments/ethereum-deployments
  factoryAddress: string

  // the address of a pool where one token is a stablecoin and the other is a
  // token that tracks the price of the native token use this to calculate the
  // price of the native token, so prefer a pool with highest liquidity
  stablecoinWrappedNativePoolAddress: string

  // true is stablecoin is token0, false if stablecoin is token1
  stablecoinIsToken0: boolean

  // the address of a token that tracks the price of the native token, most of
  // the time, this is a wrapped asset but could also be the native token itself
  // for some chains
  wrappedNativeAddress: string

  // the mimimum liquidity in a pool needed for it to be used to help calculate
  // token prices. for new chains, this should be initialized to ~4000 USD
  minimumNativeLocked: BigDecimal

  // list of stablecoin addresses
  stablecoinAddresses: string[]

  // a token must be in a pool with one of these tokens in order to derive a
  // price (in addition to passing the minimumEthLocked check). This is also
  // used to determine whether volume is tracked or not.
  whitelistTokens: string[]

  // token overrides are used to override RPC calls for the symbol, name, and
  // decimals for tokens. for new chains this is typically empty.
  tokenOverrides: StaticTokenDefinition[]

  // skip the creation of these pools in handlePoolCreated. for new chains this is typically empty.
  poolsToSkip: string[]

  // initialize this list of pools and token addresses on factory creation. for new chains this is typically empty.
  poolMappings: Array<Address[]>
}

export function getSubgraphConfig(): SubgraphConfig {
  // Update this value to the corresponding chain you want to deploy
  const selectedNetwork = dataSource.network()

  // subgraph does not support case switch with strings, hence this if else block
  if (selectedNetwork == FANTOM_NETWORK_NAME) {
    return {
      factoryAddress: '0xc05a5aa56df0dc97d6b9849a06627a079790014f',
      stablecoinWrappedNativePoolAddress: '0x87dca977a4054c03fb18834739ac1d038e1338cf', // WFTM-lzUSDC 0.3% pool
      stablecoinIsToken0: false,
      wrappedNativeAddress: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83', // WFTM
      minimumNativeLocked: BigDecimal.fromString('0'),
      stablecoinAddresses: [
        '0x28a92dde19d9989f39a49905d7c9c2fac7799bdf', // lzUSDC
        '0x1b6382dbdea11d97f24495c9a90b7c88469134a4', // axlUSDC
        '0xd226392c23fb3476274ed6759d4a478db3197d82', // axlUSDT
        '0xcc1b99ddac1a33c201a742a1851662e87bc7f22c', // lzUSDT
      ],
      whitelistTokens: [
        '0xeeeeeb57642040be42185f49c52f7e9b38f8eeee', // ELK
        '0xe1c110e1b1b4a1ded0caf3e42bfbdbb7b5d7ce1c', // oELK
        '0xe1c8f3d529bea8e3fa1fac5b416335a2f998ee1c', // lELK
        '0x5cc61a78f164885776aa610fb0fe1257df78e59b', // SPIRIT
        '0xf1648c50d2863f780c57849d812b4b7686031a3d', // lzWBTC
        '0x9ba3e4f84a34df4e08c112e1a0ff148b81655615', // SHIBA
        '0xe91d855e870bb6462ef8876d9ab9c130968b1131', // DSTEIN
        '0x695921034f0387eac4e11620ee91b1b15a6a09fe', // lzWETH
        '0xb01e8419d842beebf1b70a7b5f7142abbaf7159d', // COVER
        '0x657a1861c15a3ded9af0b6799a195a249ebdcbc6', // CREAM
        '0x1e4f97b9f9f913c46f1632781732927b9019c68b', // CRV
        '0x924828a9fb17d47d0eb64b57271d10706699ff11', // SFI
        '0xae75a438b2e0cb8bb01ec1e1e376de11d44477cc', // WSUSHI
        '0x56ee926bd8c72b2d5fa1af4d9e4cbb515a1e3adc', // SNX
        '0xb3654dc3d10ea7645f8319668e8f54d2574fbdc8', // WLINK
        '0x29b0da86e484e1c0029b56e817912d778ac0ec69', // YFI
        '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83', // WFTM
        '0x69c744d3444202d35a2783929a0f930f2fbb05ad', // SFTM
        '0x09e145a1d53c0045f41aeef25d8ff982ae74dd56', // ZOO
        '0xf16e81dce15b08f326220742020379b855b87df9', // ICE
        '0xaf319e5789945197e365e7f7fbfc56b130523b33', // FRAX
        '0xbac5d43a56696e5d0cb631609e85798f564b513b', // BITB
        '0x82f8cb20c14f134fe6ebf7ac3b903b2117aafa62', // FXS
        '0xddcb3ffd12750b45d32e084887fdf1aabab34239', // ANY
        '0x907f1a48918bb5de07c12443cab0e6eefcc611bc', // CZTEARS
        '0x6a07a792ab2965c72a5b8088d3a069a7ac3a993b', // AAVE
        '0x753fbc5800a8c8e3fb6dc6415810d627a387dfc9', // BADGER
        '0x46e7628e8b4350b2716ab470ee0ba1fa9e76c6c5', // BAND
        '0x841fad6eae12c286d1fd18d1d525dffa75c7effe', // BOO
        '0x08f6fe8f4dc577cf81e40e03e561d29b8b33e19b', // DIGG
        '0xbfaf328fe059c53d936876141f38089df0d1503d', // MM
        '0xd0660cd418a64a1d44e9214ad8e459324d8157f1', // WOOFY
        '0xf43cc235e686d7bc513f53fbffb61f760c3a1882', // ELITE
        '0xae0c241ec740309c2cbdc27456eb3c1a2ad74737', // WILD
        '0xa9937092c4e2b0277c16802cc8778d252854688a', // FOLIVE
        '0xfb98b335551a418cd0737375a2ea0ded62ea213b', // MAI
        '0x53d831e1db0947c74e8a52618f662209ec5de0ce', // SING
        '0x68aa691a8819b07988b18923f712f3f4c8d36346', // QiDAO
        '0x28a92dde19d9989f39a49905d7c9c2fac7799bdf', // lzUSDC
        '0x1b6382dbdea11d97f24495c9a90b7c88469134a4', // axlUSDC
        '0xd226392c23fb3476274ed6759d4a478db3197d82', // axlUSDT
        '0xcc1b99ddac1a33c201a742a1851662e87bc7f22c', // lzUSDT
      ],
      tokenOverrides: [
        // {
        //   address: Address.fromString('0x82af49447d8a07e3bd95bd0d56f35241523fbab1'),
        //   symbol: 'WETH',
        //   name: 'Wrapped Ethereum',
        //   decimals: BigInt.fromI32(18),
        // },
        // {
        //   address: Address.fromString('0xff970a61a04b1ca14834a43f5de4533ebddb5cc8'),
        //   symbol: 'USDC.e',
        //   name: 'USD Coin from Ethereum',
        //   decimals: BigInt.fromI32(6),
        // },
      ],
      poolsToSkip: [],
      poolMappings: [],
    }
  }  else {
    throw new Error('Unsupported Network')
  }
}
