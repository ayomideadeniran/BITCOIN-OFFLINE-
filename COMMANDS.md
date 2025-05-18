// This are the command i have

// LOAD WALLET
//  bitcoin-cli -regtest listwallets



// CREATE WALLET
// bitcoin-cli -regtest createwallet anyone


// GETNEWADDRESS
// bitcoin-cli -regtest -rpcwallet=anyone getnewaddress


// GETBALANCE
// bitcoin-cli -regtest -rpcwallet=anyone getbalance


// MINE COINS
// bitcoin-cli -regtest generatetoaddress 101 bcrt1qp4hwhnk8pclgjrmn3t37s45e2qvxlkq28qpvvp


// SEND COINS
// curl -X POST http://localhost:3001/send-to-address -H "Content-Type: application/json" -d '{"walletName":"oyin","address":"bcrt1qp4hwhnk8pclgjrmn3t37s45e2qvxlkq28qpvvp","amount":0.5}'


// Stop regtest 

bitcoin-cli -regtest stop


// Start regtest 

bitcoin-cli -reg
bitcoind -regtest -daemon