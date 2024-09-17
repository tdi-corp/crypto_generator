import * as bip39 from 'bip39'
import { BIP32Factory, BIP32Interface } from 'bip32'
import { ECPairFactory, ECPairInterface } from 'ecpair';
import * as ecc from 'tiny-secp256k1'
import * as bitcoin from 'bitcoinjs-lib'
import {libs} from '@/data/bitcoinjs-extensions'
import bchaddr from 'bchaddrjs';

import { TCryptoPathName } from '@/types/networks';
import { TPrimaryRequest, IPrimaryResponse, itemReturnNew, IAllNetworksPath } from '@/types/form';
import { getAllNetworksPath } from './getAllNetworksPath';

const bip32 = BIP32Factory(ecc)
const ECPair = ECPairFactory(ecc);
const initialTableData = getAllNetworksPath()



const isMnemonicValid = (secret: TPrimaryRequest['secret']['mnemonic']): boolean => bip39.validateMnemonic(secret)



const fetchData = (fn: any, ms = 400) => {
    return new Promise(resolve => setTimeout(() => resolve(fn), ms))
}

interface IRowSelections {
    rowSelections: any
}

interface TPrimaryRequestNew extends TPrimaryRequest, IRowSelections {}

export async function *generateCoinData ({secret, secre2type, checkBalance, rowSelections}: TPrimaryRequestNew){
    let secret2 = secret[secre2type]
    let useSecret;
    let fn: any;
    switch (secre2type) {
        case 'mnemonic':           
            if(!isMnemonicValid) {
                throw new Error('Wrong mnemonic')
            }
            useSecret = bip39.mnemonicToSeedSync(secret2)
            fn = mnemonicItem       
            break;

        case 'private':
            useSecret = secret2
            fn = privateItem
            
            break;

        default:
            
            break;
    }

 
    
    // yield 5
    let tableData: IAllNetworksPath[] = []

    initialTableData.forEach(item => {
        
        if(item.id in rowSelections) {
            tableData.push(item);
        } 
        
    })


    for(let i = 0; i < tableData.length; i++){
        yield await fetchData(fn(tableData[i], useSecret, checkBalance ))
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




const mnemonicItem = (item: any, seed: any, checkBalance: any):IPrimaryResponse | undefined => {
        /**
         * Get data
         */
        const index = item.index //0-btc, 1-btctest
        const net = item.network //bitcoin
        const pathOrigin = item.path // "m/84'/0'/0'/0/0"
        const pathName = item.pathName //p2sh
        const code = item.code;

        
        /**
         * Get network lib from libs
         */
        const network = net in libs.bitcoin.networks ? libs.bitcoin.networks[net] : undefined 
        if(!network) {
            return;
        }

                  
        const node = bip32.fromSeed(seed, network) //!!!! 
        item['path'] = pathOrigin.replace(/index/i, index+'') // ex:m/49'/0'/0'/0/0
        const keyPair = node.derivePath(item['path'])// ???? 

        const privateKey = keyPair.toWIF()

        const otherData: {balanceIsLoading: boolean, privateKey: string} = {
            balanceIsLoading: checkBalance,
            privateKey 
        }

        const payment = paymentFn(keyPair, pathName, network, code)        
        
        return itemReturnNew(item, payment, otherData)
}

const privateItem = (item: any, secret: any, checkBalance: any):IPrimaryResponse | undefined => {
        /**
         * Get data
         */
        const index = item.index //0-btc, 1-btctest
        const net = item.network //bitcoin
        const pathOrigin = item.path // "m/84'/0'/0'/0/0"
        const pathName = item.pathName //p2sh
        const code = item.code //BCH

        
        /**
         * Get network lib from libs
         */
        const network = net in libs.bitcoin.networks ? libs.bitcoin.networks[net] : undefined 
        if(!network) {
            return;
        }

                  
        item['path'] = pathOrigin.replace(/index/i, index+'') // ex:m/49'/0'/0'/0/0
        
        const keyPair = ECPair.fromWIF(secret)
        const privateKey = keyPair.toWIF()

        const otherData: {balanceIsLoading: boolean, privateKey: string} = {
            balanceIsLoading: checkBalance,
            privateKey 
        }

        const payment = paymentFn(keyPair, pathName, network, code)        
        
        return itemReturnNew(item, payment, otherData)
}


const paymentFn = (keyPair: ECPairInterface | BIP32Interface, type: TCryptoPathName, network: any, code: any): any => {

    let payment, address = null


    switch (type) {
        case 'p2wpkh':     
            payment = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network });
            break;
        case 'p2sh':
            payment = bitcoin.payments.p2sh({
                redeem: bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network }),
            });
            break;
        case 'legacy':
            payment = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network  });
            break;
        case 'multibit':
            //return bitcoin.payments.p2ms({ pubkey: keyPair.publicKey, network })
            //return bitcoin.payments.p2pk({ pubkey: keyPair.publicKey, network })
            //return bitcoin.payments.p2wsh({ pubkey: keyPair.publicKey, network })
            payment = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network });
            break;
        default:
            payment = {address: null};
    }
    address = payment?.address
    if(code === "BCH" && address) {

        if((bchaddr.isMainnetAddress)(address)) {

            // const toLegacyAddress = bchaddr.toLegacyAddress;
            // const toBitpayAddress = bchaddr.toBitpayAddress;
            const toCashAddress = bchaddr.toCashAddress;
            
            address = toCashAddress(address) //d
            // toLegacyAddress('qph5kuz78czq00e3t85ugpgd7xmer5kr7c5f6jdpwk') // 1B9UNtBfkkpgt8kVbwLN9ktE62QKnMbDzR
            // toBitpayAddress('1B9UNtBfkkpgt8kVbwLN9ktE62QKnMbDzR') // CScMwvXjdooDnGevHgfHjGWFi9cjk75Aaj
            // toCashAddress('1B9UNtBfkkpgt8kVbwLN9ktE62QKnMbDzR') // bitcoincash:qph5kuz78czq00e3t85ugpgd7xmer5kr7c5f6jdpwk
        }


    }

    return {...payment, address}
}
