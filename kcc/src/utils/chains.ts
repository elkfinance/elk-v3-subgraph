import { Address, BigDecimal, BigInt, dataSource } from '@graphprotocol/graph-ts'

import { OPTIMISM_POOL_MAPPINGS } from '../backfill/poolMappings'
import { StaticTokenDefinition } from './staticTokenDefinition'

export enum ChainId {
  MAINNET = 321,
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
      stablecoinWrappedNativePoolAddress: '0xbc81BcDDc635dfc1e6dA749B07F636294dd2b1EC', // WKCC-USDC 0.3% pool
      stablecoinIsToken0: false,
      wrappedNativeAddress: '0x980a5afef3d17ad98635f6c5aebcbaeded3c3430', // WKCC
      minimumNativeLocked: BigDecimal.fromString('0'),
      stablecoinAddresses: [
        '0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d', // BUSD
        '0x980a5afef3d17ad98635f6c5aebcbaeded3c3430', // USDC
        '0xc9baa8cfdde8e328787e29b4b078abf2dadc2055', // DAI
        '0x0039f574ee5cc39bdd162e9a88e3eb1f111baf48', // USDT
      ],
      whitelistTokens: [
        '0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d', // BUSD
        '0x980a5afef3d17ad98635f6c5aebcbaeded3c3430', // USDC
        '0xc9baa8cfdde8e328787e29b4b078abf2dadc2055', // DAI
        '0x0039f574ee5cc39bdd162e9a88e3eb1f111baf48', // USDT
        '0xeeeeeb57642040be42185f49c52f7e9b38f8eeee', // ELK
        '0xe1c110e1b1b4a1ded0caf3e42bfbdbb7b5d7ce1c', // oELK
        '0x4446fc4eb47f2f6586f9faab68b3498f86c07521', // WKCS
        '0xc0ffee0000921eb8dd7d506d4de8d5b79b856157', // KOFFEE
        '0x8933a6e58eeee063b5fd3221f2e1d17821dc1031', // ESW
        '0x980a5afef3d17ad98635f6c5aebcbaeded3c3430', // USDC
        '0x6665d66afa48f527d86623723342cfa258cb8666', // KuDo
        '0x1b465775469c71b898bb51b53b2d4464b7cd3448', // KuDOS
        '0xfc56a7e70f6c970538020cc39939929b4d393f1f', // KUST
        '0xbd451b952de19f2c7ba2c8c516b0740484e953b2', // KUD
        '0xd55d9df77b23a7455613f2244ee4b6a45b6e2d00', // SFI
        '0x006d6f38234be7f0519286011a5bf39a35d501b7', // BBC
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
