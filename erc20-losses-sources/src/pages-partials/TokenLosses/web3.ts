import { Web3 } from 'web3'

import {rpcMap, ERC20, ethRpcArray, excludedMap} from './const'
import { numberWithCommas } from "./utils";

// how many concurrent requests to make - different node may limit number of incoming requests - so 20 is a good compromise
// const asyncProcsNumber = 5  // with 50 there were some errors in requests
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
     * @param {Object} token - The token contract instance.
     * @param {string} address - The address for which to retrieve the balance.
     * @return {Promise<number>} A promise that resolves to the balance of the address.
     */
    async getBalanceOf(token: any, address: string) {
        return await token.methods.balanceOf(address).call({data: '0x1'}).catch(async () => {
            console.error(`balanceOf error: ${token._requestManager._provider.clientUrl}`);
            return await this.getBalanceOf(token, address)
        })
    }

    async distributeTasks(workers: any[], contractList: string[]): Promise<bigint[]> {
        const taskQueue: string[] = [...contractList]; // Copy of the original tasks array.
        const completedTasks: Promise<bigint>[] = [];

        while (taskQueue.length > 0) {
            // Find the first available worker.
            const availableWorkerIndex = await this.findAvailableWorker(workers);

            if (availableWorkerIndex !== -1) {
                // Assign the next task to the available worker.
                const task: string = taskQueue.shift() || '';
                const worker = workers[availableWorkerIndex];

                completedTasks.push(this.executeTask(worker, task));
            }
        }

        return Promise.all(completedTasks);
    }

    // Function to find the first available worker.
    async findAvailableWorker(workers: any[]): Promise<number> {
        return new Promise((resolve) => {
            const checkAvailability = () => {
                const index = workers.findIndex(worker => !worker.isBusy);

                if (index !== -1) {
                    resolve(index);
                } else {
                    setTimeout(checkAvailability, 10); // Check again in 100 milliseconds.
                }
            };

            checkAvailability();
        });
    }

    // Simulate task execution based on worker speed (you need to implement the actual task execution logic).
    async executeTask(worker: any, address: string): Promise<bigint> {
        return new Promise((resolve) => {
            // const executionTime = Math.random() * 1000; // Simulated execution time (adjust as needed).
            worker.isBusy = true;
            // console.time(`getBalances: ${worker.token._requestManager._provider.clientUrl} ${address}`);
            this.getBalanceOf(worker.token, address).then((balance) => {
                worker.isBusy = false;
                // console.timeEnd(`getBalances: ${worker.token._requestManager._provider.clientUrl} ${address}`);
                resolve(balance);
            });
        });
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
        const workers = [];

        if (chain === 'eth') {
            for (const rpc of ethRpcArray) {
                const web3provider = new Web3(rpc);
                workers.push({token: new web3provider.eth.Contract(ERC20, tokenObject.address), isBusy: false});
            }
        } else {
            workers.push({token: new this.web3.eth.Contract(ERC20, tokenObject.address), isBusy: false});
        }

        const balances = await this.distributeTasks(workers, contractList);

        const records = []

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

        let localList = [...contractList];

        // exclude unneeded contracts
        if (excludedMap.has(tokenAddress)) {
            const excluded: string[] = excludedMap.get(tokenAddress) || [];
            for (let ex of excluded) {
                const index = localList.indexOf(ex);
                if (index > -1) { // only splice array when item is found
                    localList.splice(index, 1); // 2nd parameter means remove one item only
                }
            }
        }

        if (!tokenObject.valid) {
            return {
                tokenAddress,
                price: 0,
                decimals: 18,
                ticker: null,
                records: []
            }
        }

        const results = await this.findBalances(localList, tokenObject);

        return {
            tokenAddress,
            ticker: tokenObject.ticker,
            decimals: tokenObject.decimals,
            price: tokenObject.price,
            records: results
        }
    }
}
