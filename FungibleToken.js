const {
  AccountId,
  PrivateKey,
  Client,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TransferTransaction,
  AccountBalanceQuery,
  TokenAssociateTransaction
} = require('@hashgraph/sdk')
require('dotenv').config()
async function createToken () {
  const myPrivateKey = process.env.privateKey
  const accountId = AccountId.fromString(process.env.accountId)
  const client = Client.forTestnet().setOperator(accountId, myPrivateKey)

  console.log(accountId)

  const supplyKey = PrivateKey.generate()
  console.log(supplyKey)
  let tokenCreateTx = await new TokenCreateTransaction()

    .setTokenName('CODERMANIA')
    .setTokenSymbol('CODERMAN')
    .setTokenType(TokenType.FungibleCommon)
    .setDecimals(2)
    .setInitialSupply(10000)
    .setTreasuryAccountId(accountId)
    .setSupplyType(TokenSupplyType.Infinite)
    .setSupplyKey(supplyKey)
    .freezeWith(client)

    //SIGN WITH TREASURY KEY
    //signing Your Transaction with private key
    let tokenCreateSign = await tokenCreateTx.sign(myPrivateKey)

    //execute the transaction

    const transact = await tokenCreateSign.execute(client)
    //GET THE TOKEN ID
    let tokenId = tokenCreateTx.tokenId

    //LOG THE TOKEN ID TO THE CONSOLE
    console.log(`- Created token with ID: ${tokenId} \n`)
}

createToken()
