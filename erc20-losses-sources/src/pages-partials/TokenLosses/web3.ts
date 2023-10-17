import { Web3 } from 'web3'

import { rpcMap, ERC20, ethRpcArray } from './const'
import { numberWithCommas } from "./utils";

// how many concurrent requests to make - different node may limit number of incoming requests - so 20 is a good compromise
const asyncProcsNumber = 10  // with 50 there were some errors in requests
const chain = 'eth' // NOTE: if chain will be changed by user - should update it according

export class Blockchain {
    private readonly web3: any
    constructor(chain: string) {
        this.web3 = new Web3(rpcMap.get(chain) || 'https://eth.meowrpc.com')
    }

    checkEthAddress(address: string) {
        try {
            this.web3.utils.toChecksumAddress(address);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Retrieves information about a token using its contract address.
     *
     * @param {string} contractAddress - The contract address of the token.
     * @return {Object} An object containing token information.
     */

    async getTokenInfo(contractAddress: string) {
        const token = new this.web3.eth.Contract(ERC20, contractAddress)

        let ticker, validToken, decimals;

        try {
            ticker = await token.methods.symbol().call({data: '0x1'}); // ticker
            decimals = await token.methods.decimals().call({data: '0x1'}); // decimals
            validToken = true;
        } catch (e) {
            validToken = false;
            ticker = 'unknown';
            decimals = 18;
        }

        // getting price from 3rd party API - may have limits on number of requests
        let priceObj = {
            price: 0,
            USD: 0
        };

        if (validToken) {
            try {
                const req = (await fetch(`https://api-data.absolutewallet.com/api/v1/currencies/minimal/${chain}/${contractAddress}?fiat=USD`));
                if (req.status === 200) {
                    priceObj = (await req.json());
                }
            } catch (e) {
                console.error(e);
            }

            if (priceObj.price === 0) {
                try {
                    const req = (await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${ticker}&tsyms=USD`));
                    if (req.status === 200) {
                        priceObj = (await req.json());

                    }
                } catch (e) {
                    console.error(e);
                }
            }
        }

        return {
            address: contractAddress,
            ticker,
            valid: validToken,
            decimals: Number(decimals) || 18,
            price: priceObj['price'] ?? priceObj['USD'] ?? 0
        }
    }

    /**
     * Retrieves the balance of a given address for a specific token.
     *
     * @param {Token} token - The token contract instance.
     * @param {string} address - The address for which to retrieve the balance.
     * @return {Promise<number>} A promise that resolves to the balance of the address.
     */
    async getBalanceOf(token: any, address: string) {
        return await token.methods.balanceOf(address).call({data: '0x1'}).catch(async () => {
            console.error(`balanceOf error: ${token._requestManager._provider.clientUrl}`);
            return await this.getBalanceOf(token, address)
        })
    }

    /**
     * Retrieves all balances on multiple contracts for a given token.
     *
     * @param {Array} contractList - the list of contract addresses to retrieve balances for
     * @param {Object} tokenObject - the token object containing token information
     * @return {Array} returns an array of records containing contract balances
     */
    async findBalances(contractList: string[], tokenObject: any) {
        // token - contract object
        const tokens = [];

        if (chain === 'eth') {
            for (const rpc of ethRpcArray) {
                const web3provider = new Web3(rpc);
                tokens.push(new web3provider.eth.Contract(ERC20, tokenObject.address));
            }
        } else {
            tokens.push(new this.web3.eth.Contract(ERC20, tokenObject.address));
        }

        let promises = []
        let counter = 0;
        const balances = []
        const records = []

        // iterate contracts
        let token = tokens[0];



        const arrayLength = tokens.length - 1;
        for (const address of contractList) {
            counter++
            promises.push(this.getBalanceOf(token, address))
            // process batch of async requests
            if (counter % asyncProcsNumber === 0) {
                const idx = counter / asyncProcsNumber >> 0;
                if (idx > arrayLength) {
                    balances.push(...await Promise.all(promises));
                    promises = [];
                    counter = 0;
                    token = tokens[0];
                } else {
                    token = tokens[idx];
                }
            }
        }
        if (promises.length) {
            balances.push(...await Promise.all(promises))
        }


        // format acquired balances
        for (let i = 0; i < balances.length; i++) {
            if (balances[i] > 0n) {
                const amount = Number(balances[i] / BigInt(Number(`1e${tokenObject.decimals}`)))
                const dollarValue = numberWithCommas(amount * tokenObject.price)
                records.push({
                    amount: BigInt(balances[i]),
                    roundedAmount: amount,
                    dollarValue,
                    contract: contractList[i]
                })
            }
        }

        // sort from max to min
        records.sort(function(a, b) {return b.roundedAmount - a.roundedAmount})

        return records
    }

    async processOneToken(contractList: string[], tokenAddress: string) {
        const tokenObject = await this.getTokenInfo(tokenAddress)

        // console.dir(tokenObject);

        if (!tokenObject.valid) {
            return {
                tokenAddress,
                price: 0,
                decimals: 18,
                ticker: null,
                records: []
            }
        }

        // NOTE decided to find lost tokens even if there are no known price
        // if (tokenObject.price === 0) {
        //     return {
        //         tokenAddress,
        //         ticker: tokenObject.ticker,
        //         decimals: tokenObject.decimals,
        //         price: -1, // no price
        //         records: []
        //     }
        // }

        const results = await this.findBalances(contractList, tokenObject);

        return {
            tokenAddress,
            ticker: tokenObject.ticker,
            decimals: tokenObject.decimals,
            price: tokenObject.price,
            records: results
        }
    }
}
