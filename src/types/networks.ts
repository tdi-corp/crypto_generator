enum ECoins {
  bitcoin = 'bitcoin',
  regtest = 'regtest',
  litecoin = 'litecoin',
  bgold = 'bgold',
  dogecoin = 'dogecoin',
  bitcoincash = 'bitcoincash',
}

type TCoins = keyof typeof ECoins

export interface ICoinData {
    code: string;
    name: string;
    index: number;
    network: TCoins;
    types: Array<number>;
    isTestingNet?: boolean | undefined
}

enum ECryptoPathName {
    p2wpkh = 'p2wpkh',
    p2sh = 'p2sh',
    legacy = 'legacy',
    multibit = 'multibit',
}
export type TCryptoPathName = keyof typeof ECryptoPathName

export type TPathItem = [number, TCryptoPathName, string, string]




export enum EendpointServices {
  blockcypher = 'blockcypher',
  blockchain_com = 'blockchain_com'
}
/*  
   name:_______________________[endpoint, [keys path to get balance]]  
*/
export type TEndpoinData = {
  [type in EendpointServices]: [string, Array<string>]
}




export enum EClients {
  coinomi = 'coinomi',
  guarda ='guarda',
  trustwallet = 'trustwallet'
}

export type TClients = {
  [type in EClients]: {
    [type in TCoins]?: Number[]
  }
}



/**
 * Not Used yet
 */
export interface ILibNetwork {
    messagePrefix: string,
    bech32?: string,
    bip32: {
      public: number | string,
      private: number | string         
    },
    pubKeyHash: number | string,
    scriptHash: number | string,
    wif: number | string     
  }
  
export interface ILibs {
    bitcoin: {
      networks: {
        [key: string]: any
      }
    }
  }