import { Address, BigDecimal, BigInt, dataSource } from '@graphprotocol/graph-ts'

import { OPTIMISM_POOL_MAPPINGS } from '../backfill/poolMappings'
import { StaticTokenDefinition } from './staticTokenDefinition'

export enum ChainId {
  MAINNET = 66,
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
      stablecoinWrappedNativePoolAddress: '0x21e6551e6c89c10c2a971c3536932b328931d84c', // WETH-USDC 0.05% pool
      stablecoinIsToken0: true,
      wrappedNativeAddress: '0x8f8526dbfd6e38e3d8307702ca8469bae6c56c15', // WETH
      minimumNativeLocked: BigDecimal.fromString('0'),
      stablecoinAddresses: [
        '0x332730a4f6e03d9c55829435f10360e13cfa41ff', // BUSD
        '0x382bb369d343125bfb2117af9c149795c6c65c50', // USDT
        '0xc946daf81b08146b1c7a8da2a851ddf2b3eaaf85', // USDC
      ],
      whitelistTokens: [
        '0x332730a4f6e03d9c55829435f10360e13cfa41ff', // BUSD
        '0x382bb369d343125bfb2117af9c149795c6c65c50', // USDT
        '0xc946daf81b08146b1c7a8da2a851ddf2b3eaaf85', // USDC
        '0xeeeeeb57642040be42185f49c52f7e9b38f8eeee', // ELK
        '0xe1c110e1b1b4a1ded0caf3e42bfbdbb7b5d7ce1c', // oELK
        '0xdcac52e001f5bd413aa6ea83956438f29098166b', // USDK
        '0x8eac9d49f71a9393ed38a619038e880c86d5745c', // PND
        '0xdf54b6c6195ea4d948d03bfd818d365cf175cfc2', // OKB
        '0x54e4622dc504176b3bb432dccaf504569699a7ff', // BTCK
        '0xef71ca2ee68f45b9ad6f72fbdb33d707b872315c', // ETHK
        '0x8f8526dbfd6e38e3d8307702ca8469bae6c56c15', // WOKT
        '0xabc732f6f69a519f6d508434481376b6221eb7d5', // DOTK
        '0x3f8969be2fc0770dcc174968e4b4ff146e0acdaf', // FILK
        '0xfa520efc34c81bfc1e3dd48b7fe9ff326049f986', // LTCK
        '0x18d103b7066aeedb6005b78a462ef9027329b1ea', // BCHK
        '0x00505505a7576d6734704fabb16f41924e3e384b', // TRXK
        '0xaa27badaa3c9ec9081b8f6c9cdd2bf375f143780', // SHIBK
        '0x218c3c3d49d0e7b37aff0d8bb079de36ae61a4c0', // WBNB
        '0x79b627bc95fa5b36eca53eb39c3cdf43aafdd10f', // ORG
        '0x97513e975a7fa9072c72c92d8000b0db90b163c5', // BabyDoge
        '0xc3bdfee6186849d5509601045af4af567a001c94', // Glory
        '0x6b7a87899490ece95443e979ca9485cbe7e71522', // HERO
        '0x748def2e7fbb37111761aa78260b0ce71e41d4ca', // COCO
        '0x03d1e72765545729a035e909edd9371a405f77fb', // nHUSD
        '0xacd7b3d9c10e97d0efa418903c0c7669e702e4c0', // ELE
        '0x02f093513b7872cdfc518e51ed67f88f0e469592', // OKFly
        '0x5ab622494ab7c5e81911558c9552dbd517f403fb', // CELT
        '0xa07403c1bd0c5cf53df07f15faa589241352527b', // BLADE
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
