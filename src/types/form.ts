import { z } from "zod"
import { ICoinData, TCryptoPathName, TPathItem } from "./networks"

// const formSchema = z.object({
//     'secre2type': z.enum([
//       'mnemonic', 
//       'private', 
//       'address'
//     ]),
//     'secret': z.string(
//       {
//         required_error: 'fuck'
//       })
//       .min(3, {message: 'too small'}),

//     'checkBalance': z.boolean()
// })

// enum FormFields0 {
//   secre2type,
//   secret,
//   checkBalance
// }

// enum FormFields {
//   secre2type = 'secre2type',
//   secret = 'secret',
//   checkBalance = 'checkBalance'
// }
// enum Secre2type0 {
//   mnemonic = 'mnemonic',
//   private = 'private',
//   address = 'address'
// }



const Secre2type = {
  mnemonic: 'mnemonic',
  private: 'private',
  address: 'address'
} as const


export const formSchema = z.object({
    secre2type: z.nativeEnum(Secre2type),
    secret: z.object({
      mnemonic: z.string().min(3, {message: 'too small'}),
      private: z.string(),
      address: z.string()
    }),
    checkBalance: z.boolean()
})

export type TPrimaryRequest = z.infer<typeof formSchema>


type IFieldData = {
  [type in TPrimaryRequest['secre2type']]: [
    string,
    string, //title
    string, //description
    string, //button
  ]
}

export const secretFieldData: IFieldData = {
  mnemonic: [
    ``, //
    'Generate', //title
    'Generate addresses and private key from mnemonic phrase', //description
    'Generate' //button
  ],
  private: [
    ``, //
    'Private', //title
    'Generate addresses from private key', //description
    'Generate' //button
  ],
  address: [
    ``, //
    'Address', //title
    'Check you balance', //description
    'Check' //button
  ],
}

export const defaultValues: TPrimaryRequest = {
  secre2type: 'mnemonic',
  secret: {
    mnemonic: 'scene reveal fruit bring expire vehicle torch rice always worth obscure pyramid',
    private: 'Kx8thA68XP1V9kwBdmoxJG51ZDZHbw6Qzpe9vfTHHFUyYP9nWp2z',
    address: 'fff',         
  },
  checkBalance: true,
}

export interface IAllNetworksPath {
  id: string;
  index: number;
  code: string;
  name: string;
  network: string;
  path: string;
  pathName: TCryptoPathName,
  pathDesc: string,
  endpoint: string | null
}

export interface IPrimaryResponse {
    id: string;
    index: number;
    code: string;
    name: string;
    network: string;
    address: string;
    privateKey?: string;
    path: string;
    pathName?: string;
    pathDesc?: string;
    endpoint?: string | null;
    balance?: number | null | string;
    balanceIsLoading?: boolean;
    balanceResponseIsError?: boolean;
    balanceResponseErrorMessage?: string;
    balanceResponseStatus?: number;
}

export const allNetworksPathReturn = (coin: ICoinData, pathItem: TPathItem, otherData: any ): IAllNetworksPath => {
  return {
    id: otherData.id,
    index: coin.index,
    code: coin.code,
    name: coin.name,
    network: coin.network,
    path: pathItem[2],
    pathName: pathItem[1],
    pathDesc: pathItem[3],
    endpoint: otherData.endpoint
  }
}

export const itemReturnNew = (allNetworksPath: IAllNetworksPath, payment: any, otherData: any ): IPrimaryResponse => {
  return {
    id: allNetworksPath.id,
    index: allNetworksPath.index,
    code: allNetworksPath.code,
    name: allNetworksPath.name,
    network: allNetworksPath.network,
    address: payment.address,
    privateKey: otherData.privateKey,
    path: allNetworksPath.path,
    pathName: allNetworksPath.pathName,
    pathDesc: allNetworksPath.pathDesc,
    // endpoint: '',
    // balance: null,
    balanceIsLoading: otherData.balanceIsLoading,
    // balanceResponseIsError: false,
    // balanceResponseErrorMessage: '',
    // balanceResponseStatus: 200      
  }
}

type TCoins = keyof IPrimaryResponse


export interface IStf {
    address: TCoins;
    code?: TCoins;
    // address: string;
    // code?: string;
    chain?: string;
}
