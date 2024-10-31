import { Address, BigDecimal, BigInt, dataSource } from '@graphprotocol/graph-ts'

import { OPTIMISM_POOL_MAPPINGS } from '../backfill/poolMappings'
import { StaticTokenDefinition } from './staticTokenDefinition'

export enum ChainId {
  MAINNET = 199,
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
      stablecoinWrappedNativePoolAddress: '0x3099067b46d3cdc978fa9c88c79c5df2c6d8e430', // WBTTC-USDT_t 0.3% pool
      stablecoinIsToken0: false,
      wrappedNativeAddress: '0x8d193c6efa90bcff940a98785d1ce9d093d3dc8a', // WBTTC
      minimumNativeLocked: BigDecimal.fromString('0'),
      stablecoinAddresses: [
        '0xe7dc549ae8db61bde71f22097becc8db542ca100', // DAI_e
        '0xde47772ac041a4ccf3c865632131d1093e51c02d', // BUSD_b
        '0xca424b845497f7204d9301bd13ff87c0e2e86fcf', // USDC_b
        '0x935faa2fcec6ab81265b301a30467bbc804b43d3', // USDC_t
        '0xae17940943ba9440540940db0f1877f101d39e8b', // USDC_e
        '0x17f235fd5974318e4e2a5e37919a209f7c37a6d1', // USDD_t
        '0x74e7cef747db9c8752874321ba8b26119ef70c9e', // USDD_b
        '0xb602f26bf29b83e4e1595244000e0111a9d39f62', // USDD_e
        '0x9b5f27f6ea9bbd753ce3793a07cba3c74644330d', // USDT_b
        '0xdb28719f7f938507dbfe4f0eae55668903d34a15', // USDT_t
      ],
      whitelistTokens: [
        '0xe7dc549ae8db61bde71f22097becc8db542ca100', // DAI_e
        '0xde47772ac041a4ccf3c865632131d1093e51c02d', // BUSD_b
        '0xca424b845497f7204d9301bd13ff87c0e2e86fcf', // USDC_b
        '0x935faa2fcec6ab81265b301a30467bbc804b43d3', // USDC_t
        '0xae17940943ba9440540940db0f1877f101d39e8b', // USDC_e
        '0x17f235fd5974318e4e2a5e37919a209f7c37a6d1', // USDD_t
        '0x74e7cef747db9c8752874321ba8b26119ef70c9e', // USDD_b
        '0xb602f26bf29b83e4e1595244000e0111a9d39f62', // USDD_e
        '0x9b5f27f6ea9bbd753ce3793a07cba3c74644330d', // USDT_b
        '0xdb28719f7f938507dbfe4f0eae55668903d34a15', // USDT_t
        '0xeeeeeb57642040be42185f49c52f7e9b38f8eeee', // ELK
        '0xcbb9edf6775e39748ea6483a7fa6a385cd7e9a4e', // BTT_b
        '0x65676055e58b02e61272cedec6e5c6d56badfb86', // BTT_e
        '0xedf53026aea60f8f75fca25f8830b7e2d6200662', // TRX
        '0x185a4091027e2db459a2433f85f894dc3013aeb5', // BNB
        '0x1249c65afb11d179ffb3ce7d4eedd1d9b98ad006', // wETH
        '0xa20dfb01dca223c0e52b0d4991d4afa7e08e3a50', // ETH_b
        '0x17501034df227d8565a8c11f41df2418f5d403b6', // JST_t
        '0x76accfb75b8bb7c6c295f04d19c1d184d274c853', // SUN_t
        '0x1a7019909b10cdd2d8b0034293ad729f1c1f604e', // BTC_b
        '0x9888221fe6b5a2ad4ce7266c7826d2ad74d40ccf', // WBTC_e
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
