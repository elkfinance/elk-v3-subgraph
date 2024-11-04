import { Address, BigDecimal, BigInt, dataSource } from '@graphprotocol/graph-ts'

import { OPTIMISM_POOL_MAPPINGS } from '../backfill/poolMappings'
import { StaticTokenDefinition } from './staticTokenDefinition'

export enum ChainId {
  OPTIMISM = 10,
}

// subgraph does not support string enums, hence these constants

const OPTIMISM_NETWORK_NAME = 'optimism'

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
  if (selectedNetwork == OPTIMISM_NETWORK_NAME) {
    return {
      factoryAddress: '0xc05a5aa56df0dc97d6b9849a06627a079790014f',
      stablecoinWrappedNativePoolAddress: '0x8a198a3ccdb3426f847b980224b04f83445294a6', // WETH-USDC 0.3% pool
      stablecoinIsToken0: true,
      wrappedNativeAddress: '0x4200000000000000000000000000000000000006', // WETH
      minimumNativeLocked: BigDecimal.fromString('0'),
      stablecoinAddresses: [
        '0x7f5c764cbc14f9669b88837ca1490cca17c31607', // USDC.e
        '0x0b2c639c533813f4aa9d7837caf62653d097ff85', // USDC
        '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', // DAI
        '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58', // USDT
      ],
      whitelistTokens: [
        '0xeeeeeb57642040be42185f49c52f7e9b38f8eeee', // ELK
        '0x4200000000000000000000000000000000000006', // WETH
        '0x8700daec35af8ff88c16bdf0418774cb3d7599b4', // SNX
        '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', // DAI
        '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58', // USDT
        '0x68f180fcce6836688e9084f035309e29bf0a2095', // WBTC
        '0xe0bb0d3de8c10976511e5030ca403dbf4c25165b', // 0xBTC
        '0x350a791bfc2c21f9ed5d10980dad2e2638ffa7f6', // LINK
        '0x65559aa14915a70190438ef90104769e5e890a00', // ENS
        '0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9', // sUSD
        '0x7f5c764cbc14f9669b88837ca1490cca17c31607', // USDC.e
        '0x0b2c639c533813f4aa9d7837caf62653d097ff85', // USDC
        '0xe405de8f52ba7559f9df3c368500b6e6ae6cee49', // sETH
        '0x298b9b95708152ff6968aafd889c6586e9169f1d', // sBTC
        '0xc5db22719a06418028a40a9b5e9a7c02959d0d08', // sLINK
        '0x6fd9d7ad17242c41f7131d257212c54a0e816691', // UNI
        '0xc40f949f8a4e094d1b49a23ea9241d289b7b2819', // LUSD
        '0xb548f63d4405466b36c0c0ac3318a22fdcec711a', // RGT
        '0x7fb688ccf682d58f86d7e38e03f9d22e7705448b', // RAI
        '0x9bcef72be871e61ed4fbbc7630889bee758eb81d', // rETH
        '0x00f932f0fe257456b32deda4758922e56a4f4b42', // PAPER
        '0x7c6b91d9be155a6db01f749217d76ff02a7227f2', // SARCO
        '0x5029c236320b8f15ef0a657054b84d90bfbeded3', // BitANT
        '0xc98b98d17435aa00830c87ea02474c5007e1f272', // BitBTC
        '0x50c5725949a6f0c72e6c4a641f24049a917db0cb', // LYRA
        '0xe7798f023fc62146e8aa1b36da45fb70855a77ea', // UMA
        '0x9e1028f5f1d5ede59748ffcee5532509976840e0', // PERP
        '0x9e5aac1ba1a2e6aed6b32689dfcf62a509ca96f3', // DF
        '0xbfd291da8a403daaf7e5e9dc1ec0aceacd4848b9', // USX
        '0x3e7ef8f50246f725885102e8238cbba33f276747', // BOND
        '0x7b0bcc23851bbf7601efc9e9fe532bf5284f65d3', // EST
        '0x1da650c3b2daa8aa9ff6f661d4156ce24d08a062', // DCN
        '0xf98dcd95217e15e05d8638da4c91125e59590b07', // KROM
        '0xaf9fe3b5ccdae78188b1f8b9a49da7ae9510f151', // DHT
        '0x3bb4445d30ac020a84c1b5a8a2c6248ebc9779d0', // LIZ
        '0x3390108e913824b8ead638444cc52b9abdf63798', // MASK
        '0x0994206dfe8de6ec6920ff4d779b0d950605fb53', // CRV
        '0xcfd1d50ce23c46d3cf6407487b2f8934e96dc8f9', // SPANK
        '0xfeaa9194f9f8c1b65429e31341a103071464907e', // LRC
        '0x217d47011b23bb961eb6d93ca9945b7501a5bb11', // THALES
        '0xba28feb4b6a6b81e3f26f08b83a19e715c4294fd', // UST
        '0xe4f27b04cc7729901876b44f4eaa5102ec150265', // XCHF
        '0x76fb31fb4af56892a25e32cfc43de717950c9278', // AAVE
        '0x81ab7e0d570b01411fcc4afd3d50ec8c241cb74b', // EQZ
        '0xdfa46478f9e5ea86d57387849598dbfb2e964b02', // MAI
        '0x9485aca5bbbe1667ad97c7fe7c4531a624c8b1ed', // agEUR
        '0xa00e3a3511aac35ca78530c85007afcd31753819', // KNC
        '0x4200000000000000000000000000000000000042', // OP
        '0xaed882f117b78034829e2cffa11206706837b1b1', // WQ
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
