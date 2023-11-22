<h1 style="text-align: center">ERC-20 Losses Calculator</h1>

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

App will be available on the [localhost:3001](localhost:3001)

<h2>Add Tokens</h2>
1. Open file `src/constants/tokens.json`
2. Add add a new token contract address

<h2>Add Contracts</h2>
1. Open file `src/constants/contracts.json`
2. Add add a new contract address

<h2>Add exclusions</h2>
1. Open file  `src/constants/excludes.json`
2. Add add a new exclusion entry
**Example**: 
```
  ["0xaaa9214f675316182eaa21c85f0ca99160cc3aaa", ["0xaaa9214f675316182eaa21c85f0ca99160cc3aaa"]],
```
**Exclusion entry format**
```
  ["TOKEN_CONTRACT_ADDRESS", ["CONTRACT_ADDRESS1","CONTRACT_ADDRESS2","CONTRACT_ADDRESS3", ...]],
```

<h2>Deployment</h2>

To deploy changes simply push changes to master branch. Any push to master branch
will trigger github action, that will build app and push it to `public` branch. 

Github Action configuration stored under following path: `.github/workflows/erc20-losses.js.yml`

If there are any problems with deployment, check following repository settings: 

- Settings > Pages > Build and deployment:

    - Source should be "Deploy from branch"
    - Branch should be "public"
    

- Settings > Actions > General > Workflow permissions

    - Check that "Allow Github Actions to create and approve pull requests" checkbox is enabled 
    
If settings are okay but there are still some issues with deployment, please contact developer to investigate the issue.