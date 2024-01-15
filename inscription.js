const ethers = require("ethers");
require("dotenv/config");

let network 
let chain_id
const mintCount = 1
const priceEffetct = 1

const customProvider = new ethers.JsonRpcProvider(process.env.RPC)

// Get Network Values
const getNetworkValues = async () => {
    network = await customProvider.getNetwork()
    chain_id = network.chainId.toString()
    console.log("Connected ChainId:", chain_id)    
}
getNetworkValues()

const prepareTransaction = async() => {      
    for (let i=0; i < mintCount; i++) {
        console.log("Inscription being engraved is :",i)
        let senderAccount = new ethers.Wallet(process.env.PKEY, customProvider)
        let senderAddress = senderAccount.address
        let gasPrice = (await customProvider.getFeeData()).gasPrice.toString()
        console.log("Gas Price:", gasPrice)

        let transactionValue = {
            to: senderAddress,
            value : 0,
            gas: '21000',
            gasPrice : gasPrice * priceEffetct,
            nonce : await customProvider.getTransactionCount(senderAddress),
            data: process.env.DATA,
            chainId: (await customProvider.getNetwork()).chainId
        }
        
        /* Not required Sign for Ethers 
        let signedTransaction = await senderAccount.signTransaction(transactionValue)
        console.log("Signed Transaction: ",signedTransaction)*/

        let hashTransaction = await senderAccount.sendTransaction(transactionValue)
        console.log("Send Transaction Detail: ", hashTransaction)
        console.log("Inscription "+i+" is completed, transaction hash is "+hashTransaction.hash)
    }
}

prepareTransaction()
    
