<h1 style="text-align: center">Token converter ERC-20 <=> ERC-223</h1>

<h2>Get started</h2>

To run development server:

- Install project dependencies
```` 
npm install 
````

- Run development server:

````
npm run dev
````

App will be available on the [localhost:3000](localhost:3000)

<h2>Add new Network</h2>

1. Open file  `src/constants/networks.ts`
2. Add new object to **NetworksConfigs** 
```
{
  name: string;
  icon: string;
  chainId: number;
  explorerTx: string;
  explorerToken: string;
  converterContract: string;
  chainConfig: Chain;
}
```
The `chainConfig` field is of type Chain from the `viem` library.
Read more: https://viem.sh/docs/clients/chains.html#chains

For most networks chainConfig - can simply be imported from `wagmi/chains`

**Example (Eth)**: 

```
import { mainnet } from "wagmi/chains";

...

mainnet: {
  name: "Ethereum mainnet",
  icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
  chainId: 1,
  explorerTx: "https://etherscan.io/tx/{tx}",
  explorerToken: "https://etherscan.io/token/{contract}",
  converterContract: "0xc68AD4DDCB3C9cAd52852E6dF7102b77c32865A5",
  chainConfig: mainnet,
}
```

**For each of the added networks, we need to add a list of tokens.**

<h2>Add | Edit Tokens lists</h2>

1. **Open** (or create) file `src/constants/tokens/$CHAIN_ID.json` where `$CHAIN_ID` is **ChainId** of the network for which you want to add the token configuration.
2. **Add** new Object to array with following required fields:
```
{
  contract: string,
  symbol: string,
  logo: string,
  decimals: number,
}
```
**Example**: 

```
{
  "contract": "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
  "symbol": "USDT",
  "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
  "decimals": 18,
},
```

<h2>Edit content</h2>

To change texts on `How it works` and `ERC-223` tabs you need **Open** file `/src/constants/content.ts`.

All other texts can be changed directly in the source code using search.


<h2>Deployment</h2>

To deploy changes simply push changes to master branch. Any push to master branch
will trigger github action, that will build app and push it to `public` branch. 

Github Action configuration stored under following path: `.github/workflows/converter.js.yml`

If there are any problems with deployment, check following repository settings: 

- Settings > Pages > Build and deployment:

    - Source should be "Deploy from branch"
    - Branch should be "public"
    

- Settings > Actions > General > Workflow permissions

    - Check that "Allow Github Actions to create and approve pull requests" checkbox is enabled 
    
If settings are okay but there are still some issues with deployment, please contact developer to investigate the issue.