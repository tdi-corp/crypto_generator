import { IStf } from "@/types/form"
import { EendpointServices, ICoinData, TEndpoinData, TPathItem } from "@/types/networks"

/**
 * Coin data
 */
export const coins: ICoinData[] = [
    // {
    //     code: '',
    //     name: '',
    //     index: 999,
    //     network: ''
    // },   
    {
        code: 'BTC',
        name: 'Bitcoin',
        index: 0,
        types: [1, 2, 3],
        network: 'bitcoin'
    },
    {
        code: 'BTC',
        name: 'Bitcoin Reg Test',
        index: 1,
        types: [],
        network: 'regtest',
        isTestingNet: true
    },    
    {
        code: 'BCH',
        name: 'Bitcoin Cash',
        index: 145,
        types: [3], // 3 - done with trustWallet
        network: 'bitcoin'
    },    
    {
        code: 'LTC',
        name: 'Litecoin',
        index: 2,
        types: [1],
        network: 'litecoin'
    },
    {
        code: 'BTG',
        name: 'Bitcoin Gold',
        index: 156,
        types: [2, 3, 4],
        network: 'bgold'
    }, 
    {
        code: 'DOGE',
        name: 'Dogecoin',
        index: 3,
        types: [3],
        network: 'dogecoin'
    },    
]


export const cryptoPath: TPathItem[] = [
    [1, 'p2wpkh', "m/84'/index'/0'/0/0", 'BIP84'],
    [2, 'p2sh', "m/49'/index'/0'/0/0", 'BIP49'],
    [3, 'legacy', "m/44'/index'/0'/0/0", 'BIP44 Legacy'], //
    [4, 'multibit', "m/0'/0/0", 'BIP32 MultiBit HD'],
]
    


export const endpointServicesData: TEndpoinData = {
   blockcypher: [
    'https://api.blockcypher.com/v1/{code}/{chain}/addrs/{address}/balance',
    ['balance']
   ],
   blockchain_com: [
    'https://blockchain.info/rawaddr/{address}',
    ['final_balance']
   ],  
} as const



const code = 'code'
const address = 'address'

export const getBalanceEndpoints: Array<[string, keyof typeof EendpointServices, IStf]> = [

    //['bitcoin', 'blockcypher', {code, chain: '_main', address}], //btc
    ['BTC', 'blockchain_com', {address}], 

    // ['litecoin', 'blockcypher', {code, chain: '_main', address}], //ltc

    ['DOGE', 'blockcypher', {code, chain: '_main', address}], //doge
]

// const clients: TClients = {
//     coinomi: {
//         bgold: [
//             3, 4
//         ]
//     },
//     guarda: {},
//     trustwallet: {},
// }
