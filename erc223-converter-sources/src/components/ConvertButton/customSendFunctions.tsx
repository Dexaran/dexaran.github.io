import { Address, formatEther, parseEther } from "viem";
import { Contract } from "ethers";
import { JsonRpcProvider,  } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import ERC20ABI from "../../constants/abi/erc20.json";
import ERC223ABI from "../../constants/abi/erc223.json";

const TEST_TOKEN_ERC20_ADDRESS: Address = "0x9e3549954138E52C230aCB92A9358C3842ABEb41";
const TEST_TOKEN_ERC223_ADDRESS: Address = "0x3133Be95A145C79240507D3aB09b1F41077041ad";
const soyAddress = "0x9FaE2529863bD691B4A7171bDfCf33C7ebB10a65";

const CLO_CONVERTER_CONTRACT_ADDRESS = "0xc676e76573267cc2E053BE8637Ba71d6BA321195";
const CLO_CONFIG = {
  name: "Callisto",
  symbol: "CLO",
  icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/2757.png",
  rpc: "https://rpc.callisto.network/",
  explorer: "https://explorer.callisto.network/",
  bridgeContractAddress: "0x9a1fc8C0369D49f3040bF49c1490E7006657ea56",
  multicallContractAddress: "0x8bA3D23241c7044bE703afAF2A728FdBc16f5F6f",
  swapRouterContractAddress: "0xeB5B468fAacC6bBdc14c4aacF0eec38ABCCC13e7",
  chainId: 820,
  color: "#1EF560FF",
}

const test_custom_send_erc20_transaction = async ({ tokenAddress = TEST_TOKEN_ERC20_ADDRESS, recipientAddress = "0x4CC3F2003303610d07b2F97d95FE629F156663C2", amount = "1" }: {tokenAddress?:string, recipientAddress?: string, amount?: string}) => {
  try {
    // const networkConfig = NetworksConfigs[network];

    const provider = new JsonRpcProvider(CLO_CONFIG.rpc);

    // const activeWallet = await getActiveWallet();
    const activeWalletPrivateKey = ""
    const activeWallet = new Wallet(activeWalletPrivateKey);

    const wallet = activeWallet.connect(provider);

    // 
    
    const ercContract: any = new Contract(tokenAddress, ERC20ABI, wallet as any);

    const ercTransferParams: any = {
      to_address: recipientAddress,
      nuberOfTokens: parseEther(amount),
    };

    const sendTokenResult = await ercContract.transfer(
      ercTransferParams.to_address,
      ercTransferParams.nuberOfTokens,
    );

    return {
      txHash: sendTokenResult?.hash,
      network: "clo",
    };

  } catch (error) {
    console.error("consttest_custom_send_erc20_transaction= ~ error:", error)
    
  }
}

const gas_limit = 100000;

const WALLET_TEST_2 = "0x4CC3F2003303610d07b2F97d95FE629F156663C2"

const test_custom_send_erc223_transaction = async ({ tokenAddress = TEST_TOKEN_ERC223_ADDRESS, recipientAddress = CLO_CONVERTER_CONTRACT_ADDRESS, amount = "1" }: { tokenAddress?: string, recipientAddress?: string, amount?: string }) => {
  try {
    // const networkConfig = NetworksConfigs[network];

    const provider = new JsonRpcProvider(CLO_CONFIG.rpc);

    // const activeWallet = await getActiveWallet();
    const activeWalletPrivateKey = "667b7fdbb728769abe46c01d71465a213342cddeb5b1d9162ca0676c6a3f659a"
    const activeWallet = new Wallet(activeWalletPrivateKey);

    const wallet = activeWallet.connect(provider);

    // 
    
    const ercContract: any = new Contract(tokenAddress, ERC223ABI, wallet as any);

    const ercTransferParams: any = {
      to_address: recipientAddress,
      nuberOfTokens: parseEther(amount),
    };

    const sendTokenResult = await ercContract.transfer(
      ercTransferParams.to_address,
      ercTransferParams.nuberOfTokens,
      {gasLimit: gas_limit}
    );

    return {
      txHash: sendTokenResult?.hash,
      network: "clo",
    };

  } catch (error) {
    console.error("consttest_custom_send_erc223_transaction= ~ error:", error)
    
  }
}
