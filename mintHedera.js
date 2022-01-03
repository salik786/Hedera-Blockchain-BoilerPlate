
const {
  Client,
  AccountCreateTransaction,
  PrivateKey,
  AccountBalanceQuery,
  Hbar,
  TransferTransaction
} = require('@hashgraph/sdk')
require('dotenv').config()//generate new keys












async function main () {
  const myPrivateKey = process.env.privateKey
  const newPublicKey = process.env.publicKey
  const myAccountId = process.env.accountId
  
  if (myAccountId == null || myPrivateKey == null) {
    throw new Error(
      'Environment variables myAccountId and myPrivateKey must be present'
    )
  }

  const client = Client.forTestnet()

  client.setOperator(myAccountId, myPrivateKey)

  //Create new keys
  const newAccountPrivateKey = await PrivateKey.generate()
  const newAccountPublicKey = newAccountPrivateKey.publicKey

  //create tranaction
  const newAccountTransactionResponse = await new AccountCreateTransaction()
    .setKey(newAccountPublicKey)
    .setInitialBalance(Hbar.fromTinybars(1000))
    .execute(client)

  const getReceipt = await newAccountTransactionResponse.getReceipt(client)
  const newAccountId = getReceipt.accountId

  console.log('The new account ID is: ' + newAccountId)

  const accountBalance = await new AccountBalanceQuery()
    .setAccountId(newAccountId)
    .execute(client)

  console.log(
    'The new account balance is: ' +
      accountBalance.hbars.toTinybars() +
      ' tinybar.'
  )

  const transferTrans =await  new TransferTransaction()
    .addHbarTransfer(myAccountId, Hbar.fromTinybars(-1000))
    .addHbarTransfer(newAccountId, Hbar.fromTinybars(1000))
    .execute(client)

  //Verify the transaction reached consensus
  const transactionReceipt = await transferTrans.getReceipt(client)
  console.log(
    'The transfer transaction from my account to the new account was: ' +
      transactionReceipt.status.toString()
  )

  //Request the cost of the query
  const queryCost = await new AccountBalanceQuery()
    .setAccountId(newAccountId)
    .getCost(client)

  console.log('The cost of query is: ' + queryCost)

  const getNewBalance = await new AccountBalanceQuery()
    .setAccountId(newAccountId)
    .execute(client)

  console.log(
    'The account balance after the transfer is: ' +
      getNewBalance.hbars.toTinybars() +
      ' tinybar.'
  )
}


main()
