import { Address, BigDecimal, BigInt, dataSource } from '@graphprotocol/graph-ts'

import { OPTIMISM_POOL_MAPPINGS } from '../backfill/poolMappings'
import { StaticTokenDefinition } from './staticTokenDefinition'

export enum ChainId {
  MAINNET = 2222,
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
      stablecoinWrappedNativePoolAddress: '0x0375cfbd69327eee285268905777c9e6f970ae20', // WETH-USDC 0.05% pool
      stablecoinIsToken0: true,
      wrappedNativeAddress: '0xc86c7c0efbd6a49b35e8714c5f59d99de09a225b', // WETH
      minimumNativeLocked: BigDecimal.fromString('0'),
      stablecoinAddresses: [
        '0x919c1c267bc06a7039e03fcc2ef738525769109c', // USDT
        '0xeb466342c4d449bc9f53a865d5cb90586f405215', // USDC Axelar
      ],
      whitelistTokens: [
        '0x919c1c267bc06a7039e03fcc2ef738525769109c', // USDT
        '0xeb466342c4d449bc9f53a865d5cb90586f405215', // USDC Axelar
        '0xeeeeeb57642040be42185f49c52f7e9b38f8eeee', // elk
        '0xe1c110e1b1b4a1ded0caf3e42bfbdbb7b5d7ce1c', // old_elk
        '0xe1c8f3d529bea8e3fa1fac5b416335a2f998ee1c', // elk_legacy
        '0xb5c4423a65b953905949548276654c96fcae6992', // WBTC
        '0x1a35ee4640b0a3b87705b0a4b45d227ba60ca2ad', // Axelar WBTC
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
