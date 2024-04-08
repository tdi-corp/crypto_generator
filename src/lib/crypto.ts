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



const fetchData = (fn: any, ms = 2000) => {
    return new Promise(resolve => setTimeout(() => resolve(fn), ms))
}

export async function *generateCoinData ({secret, secre2type, checkBalance}: TPrimaryRequest){
    let secret2 = secret[secre2type]
    let useSecret;
    let fn: any;
    switch (secre2type) {
        case 'mnemonic':           
            if(!isMnemonicValid) {
                throw new Error('Wrong mnemonic')
            }
            useSecret = bip39.mnemonicToSeedSync(secret2)
            fn = mnemonicItems        
            break;

        case 'private':
            useSecret = secret2
            fn = privateItems
            break;

        default:
            
            break;
    }

 
    
    // yield 5

    for(let i = 0; i < coins.length; i++){
        yield await fetchData(fn(i, useSecret, checkBalance ))
    }
    
}


export const setCoinToState = async (data: any, dispatch: any, createCoin: any) => {
    const generator = generateCoinData(data)

    let result;
    while(!result || !result.done){
      result = await generator.next()
      if(!result.value){
        continue;
      }
      await dispatch(createCoin(result.value))
    }

    return Promise.resolve()

}




const mnemonicItems = (i: number, seed: any, checkBalance: any):IPrimaryResponse[] | undefined => {
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
        let res = []
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

            res.push(itemReturn(item, p, payment, otherData))

        }

        return res

}

const privateItems = (i: number, secret: any, checkBalance: any):IPrimaryResponse[] | undefined => {
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

        let res = []    
        for(let t = 0; t < types.length; t++){ // ex: types: [1, 2, 3] from Array<{networks}>

            const po = cryptoPath.find(v=>v[0]===types[t]) //ex: [[1, 'p2wpkh', "m/84'/index'/0'/0/0", 'BIP84'], [...]]
            if(!po) continue;

            const p: TPathItem = [...po] //copy
            const p2 = p[1] //p2sh
            const path = p[2].replace(/index/i, index+'') //m/49'/0'/0'/0/0
            p[2] = path // add m/49'/0'/0'/0/0

            const keyPair = ECPair.fromWIF(secret)

            const privateKey = keyPair.toWIF()

            const otherData: {balanceIsLoading: boolean, privateKey: string} = {
                balanceIsLoading: checkBalance,
                privateKey 
            }

            const payment = paymentFn(keyPair, p2, network)
            res.push(itemReturn(item, p, payment, otherData))          

        }

        return res;
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
