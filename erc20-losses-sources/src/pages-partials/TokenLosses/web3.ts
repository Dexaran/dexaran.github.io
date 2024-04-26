import { Web3 } from 'web3'

import { rpcMap, ERC20, ERC20n, ethRpcArray } from './const'
import { numberWithCommas } from "./utils";

const chain = 'eth' // NOTE: if chain will be changed by user - should update it according
type TokenBalanceResult = {
    amount: bigint,
    roundedAmount: number,
    dollarValue: string,
    contract: string,
    exclude?: boolean
}

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
            validToken = true;
        } catch (e) {
            console.error('error getting token symbol');
        }

        // retry getting symbol from another node
        if (!ticker) {
            if (rpcMap.has(`${chain}2`)) {
                const rpc2 = rpcMap.get(`${chain}2`);
                const web3provider = new Web3(rpc2);
                const token2 = new web3provider.eth.Contract(ERC20, contractAddress);
                try {
                    ticker = await token2.methods.symbol().call({data: '0x1'}); // ticker
                    console.log(`"2nd token symbol" ticker: ${ticker}`)
                    validToken = true;
                } catch (e) {
                    console.error('error getting token  symbol 2nd try');
                }
            }
        }

        // NOTE some contracts have 'ticker' function instead of 'symbol'
        if (!ticker) {
            try {
                ticker = await token.methods.ticker().call({data: '0x1'}); // ticker
                validToken = true;
            } catch (e) {
                // console.error(e);
            }
        }

        // NOTE some contracts return 'symbol' as 'hex' not as 'string'
        if (!ticker) {
            try {
                const tokenNonStd = new this.web3.eth.Contract(ERC20n, contractAddress)
                const symbol32 = await tokenNonStd.methods.symbol().call({data: '0x1'})
                ticker = (this.web3.utils.hexToAscii(symbol32)).replaceAll(String.fromCharCode(0), '')
                // console.dir(ticker.charCodeAt(7));
                validToken = true
            } catch (e) {
                // console.error(e);
                validToken = false
                ticker = 'unknown'
            }
        }

        try {
            decimals = await token.methods.decimals().call({data: '0x1'}); // decimals
        } catch (e) {
            decimals = 18;
        }

        // getting price from 3rd party API - may have limits on number of requests
        let priceObj = {
            price: 0,
            USD: 0,
            logo: ''
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

            if (ticker === 'VEN') ticker = 'VET';
            if (ticker === 'GTO') ticker = 'GFT';

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
            price: priceObj['price'] ?? priceObj['USD'] ?? 0,
            logo: priceObj.logo
        }
    }


    async sleep(ms: number) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(BigInt(-1)), ms);
        });
    }

    /**
     * Retrieves the balance of a given address for a specific token.
     *
     * @param {Object} token - The token contract instance.
     * @param {string} address - The address for which to retrieve the balance.
     * @param {number} iteration - Limit number of retries .
     * @return {Promise<number>} A promise that resolves to the balance of the address.
     */
    async getBalanceOf(token: any, address: string, iteration: number): Promise<bigint> {
        // console.log(`getBalance: ${address} | ${iteration}`);
        if (iteration > 1) return BigInt(-1);

        const timeout = 4000;

        const task = token.methods.balanceOf(address).call({data: '0x1'}).catch(async () => {
            // console.error(`balanceOf error: ${token._requestManager._provider.clientUrl} | ${address} | ${iteration}`);
            return await this.getBalanceOf(token, address, ++iteration);
        })

        const waitPromise = this.sleep(timeout);
        return  Promise.race([waitPromise, task]);
    }


    async distributeTasks(workers: any[], contractList: string[]): Promise<{address: string, balance: bigint }[]> {
        const taskQueue: string[] = [...contractList]; // Copy of the original tasks array.
        const completedTasks: {address: string, balance: bigint }[] = [];

        const self = this;

        async function processTask() {
            if (taskQueue.length === 0) {
                return;
            }

            // Find the first available worker.
            const availableWorkerIndex = await self.findAvailableWorker(workers);
            if (availableWorkerIndex !== -1) {

                // Assign the next task to the available worker.
                const task = taskQueue.shift();
                if (!task) return;
                // console.log(`Processing: ${task}`);
                const worker = workers[availableWorkerIndex];
                // console.log(`at: ${worker.token._requestManager._provider.clientUrl}`);

                const result = self.executeTask(worker, task);

                result.then((taskResult) => {
                    if (taskResult === BigInt(-1)) {
                        // Task failed, reassign it to the next available worker.
                        console.log(`Reassigning task: ${task}`);
                        taskQueue.push(task);
                    } else {
                        completedTasks.push({address: task, balance: taskResult});
                    }

                    // Process the next task.
                    processTask();
                });
            }
            // }
        }

        while (taskQueue.length || !self.getWorkersStatus(workers)) {
            // console.log(completedTasks.length);
            await processTask();
            await self.sleep(50);
        }

        // console.log(`Completed: ${completedTasks.length}`);

        // return await Promise.all(completedTasks);
        return completedTasks;
    }


    getWorkersStatus(workers: any[]) {
        for (let worker of workers) {
            if (worker.isBusy && !worker.isDead) {
                // console.log(`Busy worker: ${worker.token._requestManager._provider.clientUrl} | ${worker.isBusy} | ${worker.isDead}`);
                return false;
            }
        }
        return true;
    }

    // Function to find the first available worker.
    async findAvailableWorker(workers: any[]): Promise<number> {
        return new Promise((resolve) => {
            const checkAvailability = () => {
                const index = workers.findIndex(worker => !(worker.isBusy || worker.isDead));

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
            worker.isBusy = true;
            // console.time(`getBalances: ${worker.token._requestManager._provider.clientUrl} ${address}`);
            this.getBalanceOf(worker.token, address, 0)
                .then((balance) => {
                    // console.log(`balance: ${balance}`);
                    if (balance < 0) {
                        worker.isDead = true;
                        resolve(balance);
                        console.error(`dead worker: ${worker.token._requestManager._provider.clientUrl}`);
                        return;
                    }
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
    async findBalances(contractList: string[], tokenObject: any): Promise<TokenBalanceResult[]> {
        // token - contract object
        const workers = [];

        if (chain === 'eth') {
            for (const rpc of ethRpcArray) {
                const web3provider = new Web3(rpc);
                workers.push({token: new web3provider.eth.Contract(ERC20, tokenObject.address), isBusy: false, isDead: false});
            }
        } else {
            workers.push({token: new this.web3.eth.Contract(ERC20, tokenObject.address), isBusy: false, isDead: false});
        }

        const balances = await this.distributeTasks(workers, contractList);

        const records = []

        // format acquired balances
        for (let i = 0; i < balances.length; i++) {
            if (balances[i].balance > 0n) {
                const amount = Number(balances[i].balance / BigInt(Number(`1e${tokenObject.decimals}`)))
                const dollarValue = numberWithCommas(amount * tokenObject.price)
                records.push({
                    amount: BigInt(balances[i].balance),
                    roundedAmount: amount,
                    dollarValue,
                    contract: balances[i].address
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
        // if (excludedMap.has(tokenAddress)) {
        //     const excluded: string[] = excludedMap.get(tokenAddress) || [];
        //     for (let ex of excluded) {
        //         const index = localList.indexOf(ex);
        //         if (index > -1) { // only splice array when item is found
        //             localList.splice(index, 1); // 2nd parameter means remove one item only
        //         }
        //     }
        // }

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

        // mark excluded results
        // if (excludedMap.has(tokenAddress)) {
        //     const excluded: string[] = excludedMap.get(tokenAddress) || [];
        //     for (let item of results) {
        //         if (excluded.includes(item.contract)) {
        //             item.exclude = true;
        //         }
        //     }
        // }

        return {
            tokenAddress,
            ticker: tokenObject.ticker,
            decimals: tokenObject.decimals,
            price: tokenObject.price,
            logo: tokenObject.logo,
            records: results
        }
    }


    loadExcludes(): Map<string, string[]> {
        const res = new Map();
        const excludesArray = require('@/constants/excludes.json');
        for (let item of excludesArray) {
            const key = item[0].toLowerCase();
            const values = item[1].map((val: string) => val.toLowerCase());
            res.set(key, values);
        }
        return res;
    }

}
