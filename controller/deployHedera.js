const {
  Client,
  FileCreateTransaction,
  ContractCreateTransaction,
  ContractFunctionParameters,
  ContractExecuteTransaction,
  ContractCallQuery,
  Hbar
} = require('@hashgraph/sdk')

var express=require("express");
var router = express.Router();

let helloHydra = require('../Hello_Hedera.json')
require('dotenv').config()

// storing smart contract  byte code on hydra

const accId = process.env.accountId
const privateKey = process.env.privateKey
const client = Client.forTestnet().setOperator(accId, privateKey)

async function Deploy () {
  const byteCode = helloHydra.data.bytecode.object
  // console.log(byteCode)
  const fileCreateTx = new FileCreateTransaction().setContents(byteCode)

  // console.log(fileCreateTx);
  const submitTx = await fileCreateTx.execute(client)

  //Get the receipt of the file create transaction
  const fileReceipt = await submitTx.getReceipt(client)

  // console.log(fileReceipt)
  //Get the file ID from the receipt
  const bytecodeFileId = fileReceipt.fileId

  //Log the file ID
  console.log('The smart contract byte code file ID is ' + bytecodeFileId)

  const contractTx = await new ContractCreateTransaction()
    //Set the file ID of the Hedera file storing the bytecode
    .setBytecodeFileId(bytecodeFileId)
    //Set the gas to instantiate the contract
    .setGas(100000)
    //Provide the constructor parameters for the contract
    .setConstructorParameters(
      new ContractFunctionParameters().addString('HELLO SALIK')
    )

  //Submit the transaction to the Hedera test network
  const contractResponse = await contractTx.execute(client)

  //Get the receipt of the file create transaction
  const contractReceipt = await contractResponse.getReceipt(client)

  //Get the smart contract ID
  const newContractId = contractReceipt.contractId

  //Log the smart contract ID
  console.log('The smart contract ID is ' + newContractId)
}

async function setValue () {
  //Create the transaction to update the contract message
  const contractExecTx = await new ContractExecuteTransaction()
    //Set the ID of the contract
    .setContractId(process.env.contractID)
    //Set the gas for the contract call
    .setGas(100000)
    //Set the contract function to call
    .setFunction(
      'set_message',
      new ContractFunctionParameters().addString('Hello Salik!')
    )

  //Submit the transaction to a Hedera network and store the response
  const submitExecTx = await contractExecTx.execute(client)

  //Get the receipt of the transaction
  const receipt2 = await submitExecTx.getReceipt(client)

  //Confirm the transaction was executed successfully
  console.log('The transaction status is ' + receipt2.status.toString())
}
async function getValue () {
  //Query the contract for the contract message
  const contractCallQuery = new ContractCallQuery()
    //Set the ID of the contract to query
    .setContractId(process.env.contractID)
    //Set the gas to execute the contract call
    .setGas(100000)
    //Set the contract function to call
    .setFunction('get_message')
    .setQueryPayment(new Hbar(10))

  //Submit the transaction to a Hedera network
  const contractUpdateResult = await contractCallQuery.execute(client)

  //Get the updated message at index 0
  const message2 = contractUpdateResult.getString(0)

  //Log the updated message to the console
  console.log('The updated contract message: ' + message2)
  return message2
}

setValue()
getValue()
// Deploy()

router.get('/',async function (req, res) {
  // getValue()
  const data=await getValue();
  console.log(data)
  res.send(data)
})

module.exports = router;