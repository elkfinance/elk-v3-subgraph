import { Address, BigDecimal, BigInt, dataSource } from '@graphprotocol/graph-ts'

import { OPTIMISM_POOL_MAPPINGS } from '../backfill/poolMappings'
import { StaticTokenDefinition } from './staticTokenDefinition'

export enum ChainId {
  MOONRIVER = 1285,
}

// subgraph does not support string enums, hence these constants

const MOONRIVER_NETWORK_NAME = 'moonriver'

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
  if (selectedNetwork == MOONRIVER_NETWORK_NAME) {
    return {
      factoryAddress: '0xc05a5aa56df0dc97d6b9849a06627a079790014f',
      stablecoinWrappedNativePoolAddress: '0x74d1deae61d3080b88ada0af2b88a99e056edcfd', // FRAX-WMOVR 0.3% pool
      stablecoinIsToken0: true,
      wrappedNativeAddress: '0x98878b06940ae243284ca214f92bb71a2b032b8a', // WMOVR
      minimumNativeLocked: BigDecimal.fromString('0'),
      stablecoinAddresses: [
        '0x1a93b23281cc1cde4c4741353f3064709a16197d', // FRAX
      ],
      whitelistTokens: [
        '0xeeeeeb57642040be42185f49c52f7e9b38f8eeee', // ELK
        '0xe1c110e1b1b4a1ded0caf3e42bfbdbb7b5d7ce1c', // oELK
        '0x6bd193ee6d2104f14f94e2ca6efefae561a4334b', // SOLAR
        '0x98878b06940ae243284ca214f92bb71a2b032b8a', // WMOVR
        '0xbd90a6125a84e5c512129d622a75cdde176ade5e', // RIB
        '0x480cd4fa911eeeff93cb11135c97237455617862', // KMOON
        '0xc2392dd3e3fed2c8ed9f7f0bdf6026fcd1348453', // BEANS
        '0x65e66a61d0a8f1e686c2d6083ad611a10d84d97a', // LAIKA
        '0x52f04c806eb82930f40d410259b7af8e18d3bdc9', // KAFE
        '0x3516a7588c2e6ffa66c9507ef51853eb85d76e5b', // 1SWAP
        '0xad12dab5959f30b9ff3c2d6709f53c335dc39908', // WFTM
        '0x0cae51e1032e8461f4806e26332c030e34de3adb', // MIM
        '0x15b9ca9659f5dff2b7d35a98dd0790a3cbb3d445', // DOT.m
        '0xfb2019dfd635a03cfff624d210aee6af2b00fc2c', // MAI
        '0x1a93b23281cc1cde4c4741353f3064709a16197d', // FRAX
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
