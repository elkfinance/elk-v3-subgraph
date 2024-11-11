import { Address, BigDecimal, BigInt, dataSource } from '@graphprotocol/graph-ts'

import { OPTIMISM_POOL_MAPPINGS } from '../backfill/poolMappings'
import { StaticTokenDefinition } from './staticTokenDefinition'

export enum ChainId {
  IOTEX = 4689,
}

// subgraph does not support string enums, hence these constants

const IOTEX_NETWORK_NAME = 'iotex'

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
  if (selectedNetwork == IOTEX_NETWORK_NAME) {
    return {
      factoryAddress: '0xc05a5aa56df0dc97d6b9849a06627a079790014f',
      stablecoinWrappedNativePoolAddress: '0x83c37516849c25b21d21609210b53e2b16415b7d', // WETH-USDC 0.05% pool
      stablecoinIsToken0: true,
      wrappedNativeAddress: '0xa00744882684c3e4747faefd68d283ea44099d03', // WETH
      minimumNativeLocked: BigDecimal.fromString('0'),
      stablecoinAddresses: [
        '0x6fbcdc1169b5130c59e72e51ed68a84841c98cd1', // USDT
        '0x3b2bf2b523f54c4e454f08aa286d03115aff326c', // USDC
        '0x1cbad85aa66ff3c12dc84c5881886eeb29c1bb9b', // DAI
        '0xcdf79194c6c285077a58da47641d4dbe51f63542', // USDC.e
      ],
      whitelistTokens: [
        '0xeeeeeb57642040be42185f49c52f7e9b38f8eeee', // ELK
        '0xe1ce1c0fa22ec693baca6f5076bcdc4d0183de1c', // oELK
        '0xb8744ae4032be5e5ef9fab94ee9c3bf38d5d2ae0', // VITA
        '0x0258866edaf84d6081df17660357ab20a07d0c80', // ioETH
        '0x2a6003e4b618ff3457a4a2080d028b0249b51c80', // PAXG
        '0xacee9b11cd4b3f57e58880277ac72c8c41abe4e4', // BUSD
        '0xc7b93720f73b037394ce00f954f849ed484a3dea', // WBTC
        '0xedeefaca6a1581fe2349cdfc3083d4efa8188e55', // UNI
        '0x4752456e00def6025c77b55a88a2f8a1701f92f9', // METX
        '0x888a47d81844376cbde6737bfc702a10a2175f97', // SDI
        '0x4d7b88403aa2f502bf289584160db01ca442426c', // CYC
        '0x17df9fbfc1cdab0f90eddc318c4f6fcada730cf2', // GFT
        '0x84abcb2832be606341a50128aeb1db43aa017449', // BUSDb
        '0xa00744882684c3e4747faefd68d283ea44099d03', // WIOTX
        '0x9178f4ec8a7ff6fe08e848eeac3ddbe1a5fac70d', // UP
        '0x97e6c48867fdc391a8dfe9d169ecd005d1d90283', // WBNB
        '0x8e66c0d6b70c0b23d39f4b21a1eac52bba8ed89a', // WMATIC
        '0x62a9d987cbf4c45a550deed5b57b200d7a319632', // DAIm
        '0x3cdb7c48e70b854ed2fa392e21687501d84b3afc', // USDTm
        '0x5d0f4ca481fd725c9bc6b415c0ce5b3c3bd726cf', // GFS
        '0x99b2b0efb56e62e36960c20cd5ca8ec6abd5557a', // CIOTX
        '0x490cfbf9b9c43633ddd1968d062996227ef438a9', // iMAGIC
        '0x6fbcdc1169b5130c59e72e51ed68a84841c98cd1', // USDT
        '0x3b2bf2b523f54c4e454f08aa286d03115aff326c', // USDC
        '0x1cbad85aa66ff3c12dc84c5881886eeb29c1bb9b', // DAI
        '0x86702a7f8898b172de396eb304d7d81207127915', // ZOOM
        '0x32085b8ea854529178bd0f4e92d3fd2475a3a159', // FILDA
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
