import axios, { AxiosPromise } from 'axios'
import { IPrimaryResponse, IStf } from '@/types/form'
import { getBalanceEndpoints, endpointServicesData } from '@/data/networks'


const awaitTime = 3000

const asyncData = (fn: any, ms = 0): Promise<AxiosPromise | any> => {

    return new Promise((resolve) => {
        if(ms <= 0) resolve(fn);
        setTimeout(()=>resolve(fn), ms)
    })

}

/**
 *  { response_data: { uncofirm_tr: 3, balance: 2}} - data
 * 
 *  ['response_data', 'balance] - keys
 */

const getBalanceFromResponseData = (data: object, keys: Array<string>): [boolean, any] => {

    let newData: any = data

    for(let i = 0; i < keys.length; i++) {
        const key = keys[i]

        if(!(key in newData)){
            return [false, null]
        }
        newData = newData[key]
    }

    return [true, newData]
} 


const getCryptoAddressesBalanceFromItem = async (item: IPrimaryResponse): Promise<IPrimaryResponse>=> {

        if(!item.balanceIsLoading){
            item['balanceResponseErrorMessage'] = 'Balance not need check'
            // return item
            return await asyncData(item, awaitTime)
        }

        const nid = item.network

        const allAPIData = getBalanceEndpoints.filter(ep => ep[0] === nid) // Get all need api data [] for this cryptocoin       
        const getFirstAPIData = allAPIData.length > 0 ? allAPIData[0] : null //then take first

        if(!getFirstAPIData){
            item['balanceResponseIsError'] = true
            item['balanceResponseErrorMessage'] = 'My api is not available'
            item['balanceResponseStatus'] = 500
            item['balanceIsLoading'] = false             
            // return item;
            return await asyncData(item, awaitTime)
        }

        const apiName = getFirstAPIData[1] //apiName - ex:blockcypher
        const apiRegular = getFirstAPIData[2] // ex: {code, chain: '_main', address}

        //endpointServicesData - ex: {blockcypher: ['{url}', [...{enpoint path}]], blockchain_com: [...]}
        const endpointServicesDt = endpointServicesData[apiName]; // ex: blockcypher
        const getBalanceKeys = endpointServicesDt[1] //[...{enpoint path}]
        let url = endpointServicesDt[0] //take url ex: https://api.blockcypher.com/v1/{code}/{chain}/addrs/{address}/balance


        let key: keyof IStf;
        for(key in apiRegular){ // Loop - {code, chain: '_main', address} and get standart url, ex: https://api.blockcypherd.com/v1/btc/main/addrs/bc1q9ppwz0ewr093audq2zxtvwujq9qjdh9hetslkm/balance
            const regexp = new RegExp(`\{${key}\}`, 'i')

            const val = apiRegular[key] // get value ex: code, _main, address

            if(val === undefined) {
                url = ''; 
                continue;
            }

            if(val[0] === '_'){
                url = url.replace(regexp, val.slice(1))
                
                continue
            }

            let target: any = item[val as keyof IPrimaryResponse]
            
            if(val === 'code') {
                target = target.toLowerCase()
            }
            url = url.replace(regexp, target)

        }


        item['endpoint'] = url

        const axiosConfig = {
            //timeout: 10000,
            //signal: AbortSignal.timeout(2000),
            method: "GET",
            url: item['endpoint']           
        }


        try {

            const {data, status, statusText} = await asyncData(axios.request(axiosConfig), awaitTime)

            const gbfr = getBalanceFromResponseData(data, getBalanceKeys)
            item['balance'] = gbfr[0] ? gbfr[1] : 'some error'
            item['balanceResponseIsError'] = status !== 200
            item['balanceResponseErrorMessage'] = statusText
            item['balanceResponseStatus'] = status

            // console.log('data', data, 'gbfr', gbfr);
            // console.log('item', item);
            
        } catch(e: any) {

            item['balanceResponseIsError'] = true
            item['balanceResponseErrorMessage'] = e.message
            item['balanceResponseStatus'] = 400   

            // console.log(e.message);
            
        }
        
        item['balanceIsLoading'] = false



    return item

    // const url = `https://api.blockcypherd.com/v1/btc/main/addrs/bc1q9ppwz0ewr093audq2zxtvwujq9qjdh9hetslkm/balance`

}




// const getCryptoAddressesBalanceFromArray = async (arr: IPrimaryResponse[]): Promise<IPrimaryResponse[]> => {


//     for(const item of arr){

//         const nid = item.network

//         const allAPIData = getBalanceEndpoints.filter(ep => ep[0] === nid) // Get all need api data [] for this cryptocoin; ex:[0, 'blockcypher', {code, chain: '_main', address}], //btc      
//         const getFirstAPIData = allAPIData.length > 0 ? allAPIData[0] : null //then take first

//         if(!getFirstAPIData){
//             continue;
//         }

//         const apiName = getFirstAPIData[1] //apiName - ex:blockcypher
//         const apiRegular = getFirstAPIData[2] // ex:{code, chain: '_main', address}

//         const endpointServicesDt = endpointServicesData[apiName]; //[]
//         const getBalanceKeys = endpointServicesDt[1] 
//         let url = endpointServicesDt[0] //take url ex: https://api.blockcypher.com/v1/{code}/{chain}/addrs/{address}/balance

//         let key: keyof IStf;
//         for(key in apiRegular){ // Loop - {code, chain: '_main', address} and get standart url, ex: https://api.blockcypherd.com/v1/btc/main/addrs/bc1q9ppwz0ewr093audq2zxtvwujq9qjdh9hetslkm/balance
//             const regexp = new RegExp(`\{${key}\}`, 'i')

//             const val = apiRegular[key]

//             if(val === undefined) continue;

//             if(val[0] === '_'){
//                 url = url.replace(regexp, val.slice(1))
                
//                 continue
//             }

//             const target = item[val as keyof IPrimaryResponse]
//             url = url.replace(regexp, val === 'code' ? target.toLowerCase() : target)

//         }


//         item['endpoint'] = url

//         const axiosConfig = {
//             //timeout: 10000,
//             //signal: AbortSignal.timeout(2000),
//             method: "GET",
//             url: item['endpoint']           
//         }


//         try {

//             const {data, status, statusText} = await request(axios.request(axiosConfig), 3000)

//             const gbfr = getBalanceFromResponseData(data, getBalanceKeys)
//             item['balance'] = gbfr[0] ? gbfr[1] : 'some error'
//             item['balanceResponseIsError'] = status !== 200
//             item['balanceResponseErrorMessage'] = statusText
//             item['balanceResponseStatus'] = status

//             // console.log('data', data, 'gbfr', gbfr);
//             // console.log('item', item);
            
//         } catch(e: any) {

//             item['balanceResponseIsError'] = true
//             item['balanceResponseErrorMessage'] = e.message
//             item['balanceResponseStatus'] = 400   

//             console.log(e.message);
            
//         }
        
//         item['balanceIsLoading'] = false
//     }


//     return arr

//     // const url = `https://api.blockcypherd.com/v1/btc/main/addrs/bc1q9ppwz0ewr093audq2zxtvwujq9qjdh9hetslkm/balance`

// }

export {
    // getCryptoAddressesBalanceFromArray,
    getCryptoAddressesBalanceFromItem
}