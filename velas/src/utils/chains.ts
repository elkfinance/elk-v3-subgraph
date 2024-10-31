import { Address, BigDecimal, BigInt, dataSource } from '@graphprotocol/graph-ts'

import { OPTIMISM_POOL_MAPPINGS } from '../backfill/poolMappings'
import { StaticTokenDefinition } from './staticTokenDefinition'

export enum ChainId {
  MAINNET = 106,
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
      stablecoinWrappedNativePoolAddress: '0x5ae6832ded321229cfe31afbde5811e793613ca1', // WETH-USDC 0.05% pool
      stablecoinIsToken0: true,
      wrappedNativeAddress: '0xc579d1f3cf86749e05cd06f7ade17856c2ce3126', // WETH
      minimumNativeLocked: BigDecimal.fromString('0'),
      stablecoinAddresses: [
        '0xc111c29a988ae0c0087d97b33c6e6766808a3bd3', // BUSD
      ],
      whitelistTokens: [
        '0xc111c29a988ae0c0087d97b33c6e6766808a3bd3', // BUSD
        '0xeeeeeb57642040be42185f49c52f7e9b38f8eeee', // ELK
        '0x85219708c49aa701871ad330a94ea0f41dff24ca', // WETH
        '0x2b8e9cd44c9e09d936149549a8d207c918ecb5c4', // WBNB
        '0x6ab0b8c1a35f9f4ce107ccbd05049cb1dbd99ec5', // WMATIC
        '0xeeeeeb57642040be42185f49c52f7e9b38f8eeee', // ELK
        '0xc579d1f3cf86749e05cd06f7ade17856c2ce3126', // WVLX
        '0x85219708c49aa701871ad330a94ea0f41dff24ca', // WETH
        '0x2b8e9cd44c9e09d936149549a8d207c918ecb5c4', // WBNB
        '0x6ab0b8c1a35f9f4ce107ccbd05049cb1dbd99ec5', // WMATIC
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
