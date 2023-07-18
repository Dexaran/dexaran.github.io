const web3 = new Web3("https://eth.llamarpc.com")
const ERC20 = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]

window.onload = () => {
  document.getElementById('scan').onclick = async () => {    
    const tokens = document.getElementById('tokenContracts').value.split('\n')
    const summary = []

    for (const contractAddress of tokens) {
      const token = new web3.eth.Contract(ERC20, contractAddress)
      const ticker = await token.methods.symbol().call()
      const decimals = await token.methods.decimals().call()
      const price = (await (await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${ticker}&tsyms=USD`)).json())?.USD ?? 0
    
      let stuckAmount = 0n

      for (const address of tokens) {
        if (contractAddress !== address) {
          const balance = await token.methods.balanceOf(address).call()
  
          stuckAmount += BigInt(balance)
        }
      }

      const roundedAmount = Number(stuckAmount / BigInt(Number(`1e${decimals}`)))

      summary.push({ ticker, amount: roundedAmount, asDollar: roundedAmount * price })
      document.getElementById('status').innerText = `Found ${roundedAmount} ${ticker} stuck in other contracts!`
    }
    
    document.getElementById('status').innerHTML = "Succesfully calculated how much tokens are stuck:"
    let stuckDollars = 0

    for (const log of summary) {
      stuckDollars += log.asDollar

      document.getElementById('status').innerHTML = document.getElementById('status').innerHTML + `\n+ ${log.amount} ${log.ticker} worth $${log.asDollar} is stuck.`
    }

    document.getElementById('status').innerHTML = document.getElementById('status').innerHTML + `\nAs summary $${stuckDollars} is stuck.`
  }
}