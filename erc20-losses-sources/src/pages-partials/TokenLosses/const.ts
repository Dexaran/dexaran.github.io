import eth_tokens from "@/constants/tokens.json";
import eth_contracts from "@/constants/contracts.json";

export const bsc_tokens = [
    '0xad29abb318791d579433d831ed122afeaf29dcfe', // FTM
    '0x55d398326f99059ff775485246999027b3197955', // USDT
    '0x4B0F1812e5Df2A09796481Ff14017e6005508003', // TWT
    '0xe9e7cea3dedca5984780bafc599bd69add087d56', // BUSD
    '0xba2ae424d960c26247dd6c32edc70b295c744c43', // DOGE
    '0x12BB890508c125661E03b09EC06E404bc9289040', // RACA
    '0x76a797a59ba2c17726896976b7b3747bfd1d220f', // TON
    '0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95', // BANANA
    '0xf21768ccbc73ea5b6fd3c687208a7c2def2d966e', // REEF
    '0x6810e776880c02933d47db1b9fc05908e5386b96'  // [invalid] token
]

export const bsc_contracts = [
    '0xad29abb318791d579433d831ed122afeaf29dcfe'
]

export const polygon_tokens = [
    '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // USDT
    '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC
    '0x3a3df212b7aa91aa0402b9035b098891d276572b', // FISH
]

export const polygon_contracts = [
    '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'
]

// export const contracts
export const contracts = {
    eth: eth_contracts,
    bsc: bsc_contracts,
    polygon: polygon_contracts
}

// export const tokens
export const tokens = {
    eth: eth_tokens,
    bsc: bsc_tokens,
    polygon: polygon_tokens
}

// export const rpcMap
export const rpcMap = new Map([
    ['eth', 'https://rpc.mevblocker.io'], // https://eth.meowrpc.com'], // 'https://ethereum.publicnode.com'], // 'https://eth.llamarpc.com' // https://rpc.eth.gateway.fm
    ['eth2', 'https://eth.meowrpc.com'],
    ['bsc', 'https://binance.llamarpc.com'],
    ['polygon', 'https://polygon.llamarpc.com']
])

export const ethRpcArray = [
    'https://eth.meowrpc.com', // 0:40
    'https://eth.meowrpc.com', // 0:40
    'https://eth.meowrpc.com', // 0:40
    'https://eth.meowrpc.com', // 0:40
    'https://eth.meowrpc.com', // 0:40
    'https://eth.meowrpc.com', // 0:40
    'https://eth.meowrpc.com', // 0:40
    'https://rpc.mevblocker.io/', // 0:40
    'https://rpc.mevblocker.io/', // 0:40
    'https://rpc.mevblocker.io/', // 0:40
    'https://rpc.mevblocker.io/', // 0:40
    'https://rpc.mevblocker.io/', // 0:40
    'https://rpc.mevblocker.io/', // 0:40
    'https://rpc.mevblocker.io/', // 0:40
    'https://ethereum.blockpi.network/v1/rpc/public', // 0:40
    'https://ethereum.blockpi.network/v1/rpc/public', // 0:40
    'https://ethereum.blockpi.network/v1/rpc/public', // 0:40
    'https://ethereum.blockpi.network/v1/rpc/public', // 0:40
    'https://ethereum.blockpi.network/v1/rpc/public', // 0:40
    'https://ethereum.blockpi.network/v1/rpc/public', // 0:40
    'https://eth.drpc.org', // 0:40  // disabled
    // 'https://eth.drpc.org', // 0:40  // disabled
    // 'https://eth.drpc.org', // 0:40  // disabled
    // 'https://eth-rpc.gateway.pokt.network',  // 1:10
    'https://eth-rpc.gateway.pokt.network',  // 1:10
    'https://eth.llamarpc.com', // 1:50 // disabled
    'https://eth.llamarpc.com', // 1:50 // disabled
    'https://ethereum.publicnode.com', // 1:57
    'https://ethereum.publicnode.com', // 1:57

    'https://eth-mainnet.public.blastapi.io', // bad
    'https://eth-mainnet.public.blastapi.io', // bad
    'https://eth-mainnet.public.blastapi.io', // bad
    'https://rpc.payload.de', // bad // disabled
    'https://1rpc.io/eth', // 1:06 (with errors) // disabled
    'https://rpc.ankr.com/eth', // bad // disabled
    'https://core.gashawk.io/rpc', // timeout // disabled
    'https://api.securerpc.com/v1', // bad // disabled
    'https://cloudflare-eth.com', // bad // disabled

    // 'https://rpc.eth.gateway.fm',    // bad // disabled x2
    // 'https://api.zmok.io/mainnet/oaen6dy8ff6hju9k',  // bad // disabled x2
    // 'https://uk.rpc.blxrbdn.com',    // bad // disabled x2
    // 'https://virginia.rpc.blxrbdn.com',  // bad // disabled x2
    // 'https://singapore.rpc.blxrbdn.com', // bad // disabled x2
    // 'https://eth.api.onfinality.io/public', // bad // disabled x2
    // 'https://eth-mainnet-public.unifra.io', // bad // disabled x2
    // 'https://mainnet.gateway.tenderly.co', // bad // disabled x2
]



export const excludedMap = new Map([
    ['0xaaa9214f675316182eaa21c85f0ca99160cc3aaa', ['0xaaa9214f675316182eaa21c85f0ca99160cc3aaa']], // QUANX
    ['0x5e8422345238f34275888049021821e8e08caa1f', ['0xac3e018457b222d93114458476f3e3416abbe38f']], // frxETH at strxETH
    ['0xde4EE8057785A7e8e800Db58F9784845A5C2Cbd6', ['0xde4EE8057785A7e8e800Db58F9784845A5C2Cbd6']], // DEXE
    ['0xd7c49cee7e9188cca6ad8ff264c1da2e69d4cf3b', ['0x0d438f3b5175bebc262bf23753c1e53d03432bde']], // NXM at wNXM
    ['0x622dFfCc4e83C64ba959530A5a5580687a57581b', ['0x622dFfCc4e83C64ba959530A5a5580687a57581b']], // AUTO
    ['0xd33526068d116ce69f19a9ee46f0bd304f21a51f', ['0xd33526068d116ce69f19a9ee46f0bd304f21a51f']], // RPL
    ['0x6b175474e89094c44da98b954eedeac495271d0f', ['0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643']], // DAI at cDAI
    ['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', ['0x39aa39c021dfbae8fac545936693ac917d5e7563']], // USDC at cUSDC
    ['0xa2120b9e674d3fc3875f415a7df52e382f141225', ['0xa2120b9e674d3fc3875f415a7df52e382f141225']], // ATA
    ['0x0d8775f648430679a709e98d2b0cb6250d2887ef', ['0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e']], // BAT at cBAT
    ['0xd13c7342e1ef687c5ad21b27c2b65d772cab5c8c', ['0xd13c7342e1ef687c5ad21b27c2b65d772cab5c8c']], // UOS
    ['0x0f5d2fb29fb7d3cfee444a200298f468908cc942', ['0xfd09cf7cfffa9932e33668311c4777cb9db3c9be']], // MANA at wMANA
    ['0x6b3595068778dd592e39a122f4f5a5cf09c90fe2', ['0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272']], // SUSHI at xSUSHI
    ['0x4b520c812e8430659fc9f12f6d0c39026c83588d', ['0x4f81c790581b240a5c948afd173620ecc8c71c8d']], // DG at xDG
    ['0x4a220e6096b25eadb88358cb44068a3248254675', ['0x4a220e6096b25eadb88358cb44068a3248254675']], // QNT
    ['0xdac17f958d2ee523a2206206994597c13d831ec7', ['0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9']], // USDT as cUSDT (!new)
    ['0x80fB784B7eD66730e8b1DBd9820aFD29931aab03', ['0x80fB784B7eD66730e8b1DBd9820aFD29931aab03']]  // LEND
])

// export const ERC20
export const ERC20 = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]
export const ERC20n = [{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"}]
// module.exports = { ERC20, rpcMap, tokens, contracts }