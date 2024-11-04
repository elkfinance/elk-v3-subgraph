import { Address, BigDecimal, BigInt, dataSource } from '@graphprotocol/graph-ts'

import { OPTIMISM_POOL_MAPPINGS } from '../backfill/poolMappings'
import { StaticTokenDefinition } from './staticTokenDefinition'

export enum ChainId {
  HARMONY = 1666600000,
}

// subgraph does not support string enums, hence these constants

const HARMONY_NETWORK_NAME = 'harmony'

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
  if (selectedNetwork == HARMONY_NETWORK_NAME) {
    return {
      factoryAddress: '0xc05a5aa56df0dc97d6b9849a06627a079790014f',
      stablecoinWrappedNativePoolAddress: '0xfb02f6851db15a490b67a63374a6e20202716732', // bscUSDT-WONE 0.3 pool
      stablecoinIsToken0: true,
      wrappedNativeAddress: '0xcf664087a5bb0237a0bad6742852ec6c8d69a27a', // WETH
      minimumNativeLocked: BigDecimal.fromString('0'),
      stablecoinAddresses: [
        '0xeeeeeb57642040be42185f49c52f7e9b38f8eeee', // ELK
        '0xe1c110e1b1b4a1ded0caf3e42bfbdbb7b5d7ce1c', // oELK
        '0x58f1b044d8308812881a1433d9bbeff99975e70c', // 1INCH
        '0xcf323aad9e522b93f11c352caa519ad0e14eb40f', // AAVE
        '0xdc5f76104d0b8d2bf2c2bbe06cdfe17004e9010f', // BAL
        '0x32137b9275ea35162812883582623cd6f6950958', // COMP
        '0x5c99f47e749d2fb9f6002a2945df5ea3f7162dfe', // CREAM
        '0x352cd428efd6f31b5cae636928b7b84149cf369f', // CRV
        '0x34704c70e9ec9fb9a921da6daad7d3e19f43c734', // DSLA
        '0x301259f392b551ca8c592c9f676fcd2f9a0a84c5', // MATIC
        '0x7b9c523d59aefd362247bd5601a89722e3774dd2', // SNX
        '0xbec775cb42abfa4288de81f387a9b1a3c4bc552a', // SUSHI
        '0x50ae1aba372b836523c982d8ce88e89aa8a92863', // TEL
        '0x90d81749da8867962c760414c1c25ec926e889b6', // UNI
        '0x9a89d0e1b051640c6704dde4df881f73adfef39a', // bscUSDT
        '0xe7e3c4d1cfc722b45a428736845b6aff862842a1', // WISE
        '0xa7a22299918828d791240f9ec310c2e066592053', // xSUSHI
        '0xa0dc05f84a27fccbd341305839019ab86576bc07', // YFI
        '0x2f459dd7cbcc9d8323621f6fb430cd0555411e7b', // JENN
        '0x218532a12a389a4a92fc0c5fb22901d1c19198aa', // LINK
        '0x95ce547d730519a90def30d647f37d9e5359b6ae', // LUNA
        '0x224e64ec1bdce3870a6a6c777edd450454068fec', // UST
        '0xb8e0497018c991e86311b64efd9d57b06aedbbae', // VINCI
        '0xea589e93ff18b1a1f1e9bac7ef3e86ab62addc79', // VIPER
        '0xcf664087a5bb0237a0bad6742852ec6c8d69a27a', // WONE
        '0xe064a68994e9380250cfee3e8c0e2ac5c0924548', // xVIPER
        '0x3f56e0c36d275367b8c502090edf38289b3dea0d', // MAI
      ],
      whitelistTokens: [
        '0x9a89d0e1b051640c6704dde4df881f73adfef39a', //bscUSDT
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
