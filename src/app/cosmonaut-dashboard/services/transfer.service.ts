import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  BankBalancesResponse,
  BroadcastMode,
  LcdClient,
  setupAuthExtension,
  setupBankExtension,
  SigningCosmosClient,
  BroadcastTxResult,
  StdFee,
  coins,
} from "@cosmjs/launchpad";
import { CosmWasmClient, MsgExecuteContract } from '@cosmjs/cosmwasm';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
declare let window: any;
declare let document: any;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

export interface ExBankBalancesResponse {
  address: String,
  balance: BankBalancesResponse
}
@Injectable({
  providedIn: 'root'
})
export class TransferService {
  private enable: any;
  client = LcdClient.withExtensions(
    { apiUrl: environment.lightClient, broadcastMode: BroadcastMode.Block },
    setupAuthExtension,
    setupBankExtension
  );
  chainId = "hackatom-wasm";

  wasmClient = new CosmWasmClient(environment.lightClient, BroadcastMode.Block)


  constructor(private http: HttpClient) {

    window.onload = async () => {
      // Keplr extension injects the offline signer that is compatible with cosmJS.
      // You can get this offline signer from `window.getOfflineSigner(chainId:string)` after load event.
      // And it also injects the helper function to `window.keplr`.
      // If `window.getOfflineSigner` or `window.keplr` is null, Keplr extension may be not installed on browser.
      if (!window.getOfflineSigner || !window.keplr) {
        alert("Please install keplr extension");
      } else {
        if (window.keplr.experimentalSuggestChain) {
          try {
            // Keplr v0.6.4 introduces an experimental feature that supports the feature to suggests the chain from a webpage.
            // cosmoshub-3 is integrated to Keplr so the code should return without errors.
            // The code below is not needed for cosmoshub-3, but may be helpful if you’re adding a custom chain.
            // If the user approves, the chain will be added to the user's Keplr extension.
            // If the user rejects it or the suggested chain information doesn't include the required fields, it will throw an error.
            // If the same chain id is already registered, it will resolve and not require the user interactions.
            await window.keplr.experimentalSuggestChain({
              // Chain-id of the Cosmos SDK chain.
              chainId: "hackatom-wasm",
              // The name of the chain to be displayed to the user.
              chainName: "hackatom-wasm",
              // RPC endpoint of the chain.
              rpc: "https://rpc.cosmwasm.hub.hackatom.dev",
              // REST endpoint of the chain.
              rest: environment.lightClient,
              // Staking coin information
              stakeCurrency: {
                // Coin denomination to be displayed to the user.
                coinDenom: "COSM",
                // Actual denom (i.e. uatom, uscrt) used by the blockchain.
                coinMinimalDenom: "ucosm",
                // # of decimal points to convert minimal denomination to user-facing denomination.
                coinDecimals: 6,
                // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
                // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
                // coinGeckoId: ""
              },
              // (Optional) If you have a wallet webpage used to stake the coin then provide the url to the website in `walletUrlForStaking`.
              // The 'stake' button in Keplr extension will link to the webpage.
              // walletUrlForStaking: "",
              // The BIP44 path.
              bip44: {
                // You can only set the coin type of BIP44.
                // 'Purpose' is fixed to 44.
                coinType: 118,
              },
              // Bech32 configuration to show the address to user.
              // This field is the interface of
              // {
              //   bech32PrefixAccAddr: string;
              //   bech32PrefixAccPub: string;
              //   bech32PrefixValAddr: string;
              //   bech32PrefixValPub: string;
              //   bech32PrefixConsAddr: string;
              //   bech32PrefixConsPub: string;
              // }
              bech32Config: {
                bech32PrefixAccAddr: "cosmos",
                bech32PrefixAccPub: "cosmospub",
                bech32PrefixValAddr: "cosmosvaloper",
                bech32PrefixValPub: "cosmosvaloperpub",
                bech32PrefixConsAddr: "cosmosvalcons",
                bech32PrefixConsPub: "cosmosvalconspub"
              },
              // List of all coin/tokens used in this chain.
              currencies: [{
                // Coin denomination to be displayed to the user.
                coinDenom: "COSM",
                // Actual denom (i.e. uatom, uscrt) used by the blockchain.
                coinMinimalDenom: "ucosm",
                // # of decimal points to convert minimal denomination to user-facing denomination.
                coinDecimals: 6,
                // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
                // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
                // coinGeckoId: ""
              }],
              // List of coin/tokens used as a fee token in this chain.
              feeCurrencies: [{
                // Coin denomination to be displayed to the user.
                coinDenom: "COSM",
                // Actual denom (i.e. uatom, uscrt) used by the blockchain.
                coinMinimalDenom: "ucosm",
                // # of decimal points to convert minimal denomination to user-facing denomination.
                coinDecimals: 6,
                // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
                // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
                // coinGeckoId: ""
              }],
              // (Optional) The number of the coin type.
              // This field is only used to fetch the address from ENS.
              // Ideally, it is recommended to be the same with BIP44 path's coin type.
              // However, some early chains may choose to use the Cosmos Hub BIP44 path of '118'.
              // So, this is separated to support such chains.
              coinType: 118,
              // (Optional) This is used to set the fee of the transaction.
              // If this field is not provided, Keplr extension will set the default gas price as (low: 0.01, average: 0.025, high: 0.04).
              // Currently, Keplr doesn't support dynamic calculation of the gas prices based on on-chain data.
              // Make sure that the gas prices are higher than the minimum gas prices accepted by chain validators and RPC/REST endpoint.
              gasPriceStep: {
                low: 0.01,
                average: 0.025,
                high: 0.04
              }
            });
          } catch {
            alert("Failed to suggest the chain");
          }
        } else {
          alert("Please use the recent version of keplr extension");
        }
      }

      // You should request Keplr to enable the wallet.
      // This method will ask the user whether or not to allow access if they haven't visited this website.
      // Also, it will request user to unlock the wallet if the wallet is locked.
      // If you don't request enabling before usage, there is no guarantee that other methods will work.
      await window.keplr.enable(this.chainId);
      // const offlineSigner = window.getOfflineSigner(this.chainId);

      // You can get the address/public keys by `getAccounts` method.
      // It can return the array of address/public key.
      // But, currently, Keplr extension manages only one address/public key pair.
      // XXX: This line is needed to set the sender address for SigningCosmosClient.
      // const accounts = await offlineSigner.getAccounts();

      // Initialize the gaia api with the offline signer that is injected by Keplr extension.
      // const cosmJS = new SigningCosmosClient(
      //   environment.lightClient,
      //   accounts[0].address,
      //   offlineSigner,
      // );
    }
  }

  // queries
  async getAccount(): Promise<ExBankBalancesResponse> {
    const response: ExBankBalancesResponse = <ExBankBalancesResponse>{};
    const offlineSigner = window.getOfflineSigner(this.chainId);
    const accounts = await offlineSigner.getAccounts();
    response.address = accounts[0].address;
    response.balance = await this.client.bank.balances(accounts[0].address);
    return response;
  }

  queryCosmonaut(cont_addr: string, token_id: string): Promise<any> {
    return this.wasmClient.queryContractSmart(cont_addr, { nft_info: { token_id } });
  }

  queryAllCosmonautInfo(cont_addr: string, token_id: string): Promise<any> {
    return this.wasmClient.queryContractSmart(cont_addr, { all_nft_info: { token_id } });
  }

  queryNumOfCosmonaut(cont_addr: string): Promise<any> {
    return this.wasmClient.queryContractSmart(cont_addr, { num_tokens: {} })
  }

  // change limit to dynamic 
  queryAllCosmonautAddr(cont_addr: string): Promise<any> {
    return this.wasmClient.queryContractSmart(cont_addr, { all_tokens: { limit: 1000 } })
  }

  queryCW20Token(cont_addr: string, address: string): Promise<any> {
    return this.wasmClient.queryContractSmart(cont_addr, { balance: { address } })
  }

  queryNFTOfferings(cont_addr: string): Promise<any> {
    return this.wasmClient.queryContractSmart(cont_addr, { get_offerings: {} })
  }

  // execute
  async mintCosmonaut(cont_addr: string, token_id: string, name: string, level: number, description: string, image: any): Promise<BroadcastTxResult> {
    const offlineSigner = window.getOfflineSigner(this.chainId);
    const accounts = await offlineSigner.getAccounts();
    const owner = accounts[0].address;
    const fee: StdFee = {
      amount: coins(5000000, "ucosm"),
      gas: "89000000",
    };
    const msg: MsgExecuteContract = {
      type: "wasm/MsgExecuteContract",
      value: {
        sender: owner,
        contract: cont_addr,
        msg: {
          mint: { token_id, owner, name, level, description, image }
        },
        sent_funds: [],
      },
    };
    const client = new SigningCosmosClient(environment.lightClient, accounts[0].address, offlineSigner);
    return client.signAndBroadcast([msg], fee);
  }

  async battleCosmonaut(cont_addr: string, attacker_id: string, defender_id: string): Promise<BroadcastTxResult> {
    const offlineSigner = window.getOfflineSigner(this.chainId);
    const accounts = await offlineSigner.getAccounts();
    const owner = accounts[0].address;
    const fee: StdFee = {
      amount: coins(50000, "ucosm"),
      gas: "200000",
    };
    const msg: MsgExecuteContract = {
      type: "wasm/MsgExecuteContract",
      value: {
        sender: owner,
        contract: cont_addr,
        msg: {
          battle_cosmonaut: { attacker_id, defender_id }
        },
        sent_funds: [],
      },
    };
    const client = new SigningCosmosClient(environment.lightClient, accounts[0].address, offlineSigner);
    return client.signAndBroadcast([msg], fee);
  }

  async sellCosmonaut(cont_addr_721: string, cont_addr_market: string, cont_addr_20, token_id: string, amount: string): Promise<BroadcastTxResult> {
    const offlineSigner = window.getOfflineSigner(this.chainId);
    const accounts = await offlineSigner.getAccounts();
    const owner = accounts[0].address;
    const fee: StdFee = {
      amount: coins(5000, "ucosm"),
      gas: "182146",
    };
    const msg: MsgExecuteContract = {
      type: "wasm/MsgExecuteContract",
      value: {
        sender: owner,
        contract: cont_addr_721,
        msg: {
          send_nft: {
            contract: cont_addr_market,
            token_id: token_id,
            msg: btoa(JSON.stringify({ "list_price": { "address": cont_addr_20, "amount": amount } }))
          }
        },
        sent_funds: [],
      },
    };
    const client = new SigningCosmosClient(environment.lightClient, accounts[0].address, offlineSigner);
    return client.signAndBroadcast([msg], fee);
  }

  async withdrawCosmonaut(cont_addr_market: string, offering_id: string): Promise<BroadcastTxResult> {
    const offlineSigner = window.getOfflineSigner(this.chainId);
    const accounts = await offlineSigner.getAccounts();
    const owner = accounts[0].address;
    const fee: StdFee = {
      amount: coins(5000, "ucosm"),
      gas: "165825",
    };
    const msg: MsgExecuteContract = {
      type: "wasm/MsgExecuteContract",
      value: {
        sender: owner,
        contract: cont_addr_market,
        msg: {
          withdraw_nft: { offering_id }
        },
        sent_funds: [],
      },
    };
    const client = new SigningCosmosClient(environment.lightClient, accounts[0].address, offlineSigner);
    return client.signAndBroadcast([msg], fee);
  }

  async buyCosmonaut(cont_addr_20: string, cont_addr_market: string, amount: string, offering_id: string): Promise<BroadcastTxResult> {
    const offlineSigner = window.getOfflineSigner(this.chainId);
    const accounts = await offlineSigner.getAccounts();
    const owner = accounts[0].address;
    const fee: StdFee = {
      amount: coins(10000, "ucosm"),
      gas: "520146",
    };
    const msg: MsgExecuteContract = {
      type: "wasm/MsgExecuteContract",
      value: {
        sender: owner,
        contract: cont_addr_20,
        msg: {
          send: {
            contract: cont_addr_market,
            amount: amount,
            msg: btoa(JSON.stringify({ "offering_id": offering_id }))
          }
        },
        sent_funds: [],
      },
    };
    const client = new SigningCosmosClient(environment.lightClient, accounts[0].address, offlineSigner);
    return client.signAndBroadcast([msg], fee);
  }

  // http requests
  requestCW20Tokens(address: string): Observable<any> {
    return this.http.post<any>(environment.cw20faucet, { "address": address }, httpOptions);
  }
}
