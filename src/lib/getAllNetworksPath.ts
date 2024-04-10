import { IAllNetworksPath, allNetworksPathReturn } from "@/types/form";
import { TPathItem } from '@/types/networks';
import {libs} from '@/data/bitcoinjs-extensions'
import { coins, cryptoPath } from '@/data/networks';


const getAllNetworksPath = (): IAllNetworksPath[] => {

    let result = [];
    for(let i = 0; i<coins.length; i++) {

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
            continue;
        }

                  
        // const node = bip32.fromSeed(seed, network) //!!!! 
        for(let t = 0; t < types.length; t++){ // ex: types: [1, 2, 3] from Array<{networks}>

            const po = cryptoPath.find(v=>v[0]===types[t]) // ex: [[1, 'p2wpkh', "m/84'/index'/0'/0/0", 'BIP84'], [...]]
            if(!po) continue;

            const p: TPathItem = [...po] //copy
            const path = p[2].replace(/index/i, index+'') // ex:m/49'/0'/0'/0/0
            p[2] = path // add m/49'/0'/0'/0/0

            const otherData: {id: string} = {
                id: `${net}_${p[0]}`
            }


            result.push(allNetworksPathReturn(item, p, otherData))

        }        

    }

    return result;
}

export {getAllNetworksPath}