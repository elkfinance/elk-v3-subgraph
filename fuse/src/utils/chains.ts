import { Address, BigDecimal, BigInt, dataSource } from '@graphprotocol/graph-ts'

import { OPTIMISM_POOL_MAPPINGS } from '../backfill/poolMappings'
import { StaticTokenDefinition } from './staticTokenDefinition'

export enum ChainId {
  FUSE = 122,
}

// subgraph does not support string enums, hence these constants

const FUSE_NETWORK_NAME = 'fuse'

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
  if (selectedNetwork == FUSE_NETWORK_NAME) {
    return {
      factoryAddress: '0xc05a5aa56df0dc97d6b9849a06627a079790014f',
      stablecoinWrappedNativePoolAddress: '0xca4a3dacddf33d83c8d43b1152d0c8aadbc88b8b', // WFUSE-FUSDV3 0.3% pool
      stablecoinIsToken0: false,
      wrappedNativeAddress: '0x0be9e53fd7edac9f859882afdda116645287c629', // WETH
      minimumNativeLocked: BigDecimal.fromString('0'),
      stablecoinAddresses: [
        '0xce86a1cf3cff48139598de6bf9b1df2e0f79f86f', // fUSDv3
      ],
      whitelistTokens: [
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
