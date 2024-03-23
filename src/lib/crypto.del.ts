import * as bip39 from 'bip39'
import { BIP32Factory, BIP32Interface } from 'bip32'
import { ECPairFactory, ECPairInterface } from 'ecpair';
import * as ecc from 'tiny-secp256k1'
import * as bitcoin from 'bitcoinjs-lib'
import {libs} from './bitcoinjs-extensions'

import { coins, cryptoPath } from './networks';
import { TCryptoPathName, TPathItem } from '@/types/networks';
import { TPrimaryRequest, IPrimaryResponse, itemReturn } from '@/types/form';

const bip32 = BIP32Factory(ecc)
const ECPair = ECPairFactory(ecc);


const isMnemonicValid = (secret: TPrimaryRequest['secret']['mnemonic']): boolean => bip39.validateMnemonic(secret)



const fetchData = (fn: any) => {
    return new Promise(resolve => setTimeout(() => resolve(fn), 3000))
}

export async function *generateCoinData ({secret, secre2type, checkBalance}: TPrimaryRequest){
    const secret2 = secret[secre2type]
    const seed = bip39.mnemonicToSeedSync(secret2)

    for(let i = 0; i < coins.length; i++){
        yield await fetchData(mnemonicItem(i, seed, checkBalance ))
    }
    
}



const generator = ({secret, secre2type, checkBalance}: TPrimaryRequest): Promise<IPrimaryResponse[]> => {

    const secret2 = secret[secre2type]

    let res:IPrimaryResponse[] = []

    switch (secre2type) {
        case 'mnemonic':           
            if(!isMnemonicValid) {
                throw new Error('Wrong mnemonic')
            }
            const seed = bip39.mnemonicToSeedSync(secret2)
            res = cryptoItemsGenerator(seed, checkBalance, mnemonicItem)          
            break;

        case 'private':
            res = cryptoItemsGenerator(secret2, checkBalance, privateItem) 
            break;

        default:
            break;
    }

    return new Promise((resolve) => {
        setTimeout(()=> {
            resolve(res)
        }, 2000)
    })
}

interface ICryptoItemsGenerator<TSM, TSP, TC> {
    (
        secret: TSM | TSP | Buffer,
        checkBalance: TC,
        generateItemFn: (i: number, s: string | Buffer, c: TC) => any
    ): IPrimaryResponse[]
}

const cryptoItemsGenerator:ICryptoItemsGenerator<
        TPrimaryRequest['secret']['mnemonic'], 
        TPrimaryRequest['secret']['private'], 
        TPrimaryRequest['checkBalance']
    > = (secret, checkBalance, generateItemFn) => {

    let res = []

    for(let i = 0; i < coins.length; i++){ // ex: [{code: 'BTC', name: 'Bitcoin', index: 0, types: [1, 2, 3], network: 'bitcoin'}, {...}]

        const item = generateItemFn(i, secret, checkBalance)
        item && res.push(item)  

    }

    return res;
}


const mnemonicItem = (i: number, seed: any, checkBalance: any):IPrimaryResponse | undefined => {
        /**
         * Get data
         */
        const item = coins[i]
        const index = item.index //0-btc, 1-btctest
        const net = item.network //bitcoin
        const types = item.types //array

        
        /**
         * Get network lib from libs
         */
        const network = net in libs.bitcoin.networks ? libs.bitcoin.networks[net] : undefined 
        if(!network) {
            return;
        }

                  
        const node = bip32.fromSeed(seed, network) //!!!! 

        for(let t = 0; t < types.length; t++){ // ex: types: [1, 2, 3] from Array<{networks}>

            const po = cryptoPath.find(v=>v[0]===types[t]) // ex: [[1, 'p2wpkh', "m/84'/index'/0'/0/0", 'BIP84'], [...]]
            if(!po) continue;

            const p: TPathItem = [...po] //copy
            const p2 = p[1] //p2sh
            const path = p[2].replace(/index/i, index+'') // ex:m/49'/0'/0'/0/0
            p[2] = path // add m/49'/0'/0'/0/0
            const keyPair = node.derivePath(path)// ???? 

            const privateKey = keyPair.toWIF()

            const otherData: {balanceIsLoading: boolean, privateKey: string} = {
                balanceIsLoading: checkBalance,
                privateKey 
            }

            const payment = paymentFn(keyPair, p2, network)

            return itemReturn(item, p, payment, otherData)

        }

}

const privateItem = (i: number, secret: any, checkBalance: any):IPrimaryResponse | undefined => {
        /**
         * Get data
         */
        const item = coins[i]
        const index = item.index //0-btc, 1-btctest
        const net = item.network //bitcoin
        const types = item.types //array

        
        /**
         * Get network lib from libs
         */
        const network = net in libs.bitcoin.networks ? libs.bitcoin.networks[net] : undefined 
        if(!network) {
            return;
        }

                  
        for(let t = 0; t < types.length; t++){ // ex: types: [1, 2, 3] from Array<{networks}>

            const po = cryptoPath.find(v=>v[0]===types[t]) //ex: [[1, 'p2wpkh', "m/84'/index'/0'/0/0", 'BIP84'], [...]]
            if(!po) continue;

            const p: TPathItem = [...po] //copy
            const p2 = p[1] //p2sh
            const path = p[2].replace(/index/i, index+'') //m/49'/0'/0'/0/0
            p[2] = path // add m/49'/0'/0'/0/0

            const keyPair =ECPair.fromWIF(secret)

            const privateKey = keyPair.toWIF()

            const otherData: {balanceIsLoading: boolean, privateKey: string} = {
                balanceIsLoading: checkBalance,
                privateKey 
            }

            const payment = paymentFn(keyPair, p2, network)
            return itemReturn(item, p, payment, otherData)          

        }
}


const paymentFn = (keyPair: ECPairInterface | BIP32Interface, type: TCryptoPathName, network: any): any => {

    switch (type) {
        case 'p2wpkh':          
            return bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network });
        case 'p2sh':
            return bitcoin.payments.p2sh({
                redeem: bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network }),
            });
        case 'legacy':
            return bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network  });
        case 'multibit':
            //return bitcoin.payments.p2ms({ pubkey: keyPair.publicKey, network })
            //return bitcoin.payments.p2pk({ pubkey: keyPair.publicKey, network })
            //return bitcoin.payments.p2wsh({ pubkey: keyPair.publicKey, network })
            return bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network });
        default:
            return null;
    }
}

export type TCryptoData = Awaited<ReturnType<typeof generator>>;

export default generator
