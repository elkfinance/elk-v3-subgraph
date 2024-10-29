import { Address, BigDecimal, BigInt, dataSource } from '@graphprotocol/graph-ts'

import { OPTIMISM_POOL_MAPPINGS } from '../backfill/poolMappings'
import { StaticTokenDefinition } from './staticTokenDefinition'

export enum ChainId {
  MAINNET = 35441
}

// subgraph does not support string enums, hence these constants
const MAINNET_NETWORK_NAME = 'mainnet'

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
  if (selectedNetwork == MAINNET_NETWORK_NAME) {
    return {
      factoryAddress: '0xc05a5aa56df0dc97d6b9849a06627a079790014f',
      stablecoinWrappedNativePoolAddress: '0xc493f1436b4129b57fb7d129ea4409b2200f69a8', // WQGOV-QUSD 0.05% pool
      stablecoinIsToken0: false,
      wrappedNativeAddress: '0xd07178e3ecbc78de110df84fe1a979d5f349784a', // WQGOV
      minimumNativeLocked: BigDecimal.fromString('0'),
      stablecoinAddresses: [
        '0x79cb92a2806bf4f82b614a84b6805963b8b1d8bb', // USDC
        '0xe31dd093a2a0adc80053bf2b929e56abfe1b1632', // QUSD
        '0xdeb87c37dcf7f5197026f574cd40b3fc8aa126d1', // dai
      ],
      whitelistTokens: [
        '0xd07178e3ecbc78de110df84fe1a979d5f349784a', // WQGOV
        '0xeeeeeb57642040be42185f49c52f7e9b38f8eeee', // elk
        '0xe1c110e1b1b4a1ded0caf3e42bfbdbb7b5d7ce1c', // old_elk
        '0xe1c8f3d529bea8e3fa1fac5b416335a2f998ee1c', // elk_legacy
        '0xd56f9fff3fe3bd0c7b52aff9a42eb70e05a287cc', // weth
        '0xe4fadbbf24f118b1e63d65f1aac2a825a07f7619', // vnxau
        '0xde397e6c442a3e697367decbf0d50733dc916b79', // wbtc
      ],
      tokenOverrides: [],
      poolsToSkip: [],
      poolMappings: [],
    }
  } else {
    throw new Error('Unsupported Network')
  }
}
