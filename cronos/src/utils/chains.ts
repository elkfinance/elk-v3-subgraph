import { Address, BigDecimal, BigInt, dataSource } from '@graphprotocol/graph-ts'

import { OPTIMISM_POOL_MAPPINGS } from '../backfill/poolMappings'
import { StaticTokenDefinition } from './staticTokenDefinition'

export enum ChainId {
  MAINNET = 25,
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
      stablecoinWrappedNativePoolAddress: '0x8ff66586d8e6878f9cb73fe793940c07c9444d0e', // WCRO-USDC 0.05% pool
      stablecoinIsToken0: false,
      wrappedNativeAddress: '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23', // WETH
      minimumNativeLocked: BigDecimal.fromString('0'),
      stablecoinAddresses: [
        '0x66e428c3f67a68878562e79a0234c1f83c208770', //USDT
        '0xf2001b145b43032aaf5ee2884e456ccd805f677d', //dai
        '0xc21223249ca28397b4b6541dffaecc539bff0c59', // USDC
      ],
      whitelistTokens: [
        '0x66e428c3f67a68878562e79a0234c1f83c208770', //USDT
        '0xf2001b145b43032aaf5ee2884e456ccd805f677d', //dai
        '0xc21223249ca28397b4b6541dffaecc539bff0c59', // USDC
        '0xeeeeeb57642040be42185f49c52f7e9b38f8eeee', // elk
        '0xe1c110e1b1b4a1ded0caf3e42bfbdbb7b5d7ce1c', // old_elk
        '0xe1c8f3d529bea8e3fa1fac5b416335a2f998ee1c', // elk_legacy
        '0xe44fd7fcb2b1581822d0c862b68222998a0c299a', //WETH
        '0x30078453dead93bdbc31b9a18ac0a6ece171f459', //UtilityCro
        '0xbdd4e5660839a088573191a9889a262c0efc0983', //Photonswap
        '0x2ae35c8e3d4bd57e8898ff7cd2bbff87166ef8cb', //mimatic
        '0xa169dd64b901affd3e6cb601a63412e0a840b4bc', //moonbys
        '0x00fe915a5209e74d5a88334cc2daa4541aec8278', //goal
        '0x6519bd0745f21f34c22bbb16aba24601e9b1f366', //crosaitama
        '0xe243ccab9e66e6cf1215376980811ddf1eb7f689', // crx
        '0xd4b9dd61eba441f706eb4728518d1efc20af4ee8', //crowwithknife
        '0xefe15a7232b9f0aa890ff97aaf53afe87d00f8be', //btcronos
        '0x55210c2a69b4c52a9d9289a257d54d35c4a2d2ec', //crobank
        '0x0dcb0cb0120d355cde1ce56040be57add0185baa', //autofarm
      
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
