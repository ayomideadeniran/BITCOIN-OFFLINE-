# Bitcoin Offline Transaction Simulator (Backend)

This project provides a Node.js backend that interfaces with `bitcoind` in Regtest mode to simulate offline Bitcoin transactions. It supports wallet creation, address generation, PSBT creation, signing, broadcasting, and more.

---

## 🛠️ Features

- Create and manage Bitcoin wallets (regtest)
- Generate receiving addresses
- Create PSBT transactions
- Sign and broadcast transactions
- List balances and transaction history
- Designed for integration with a React frontend

---

## 🚀 Getting Started

### ✅ Prerequisites

1. **Node.js** and **npm**
2. **bitcoind** installed and running in Regtest mode
3. **A funded regtest wallet**

---

### ⚙️ Setup Instructions

#### 1. **Clone the repository**

```bash
git clone https://github.com/yourusername/bitcoin-offline-backend.git
cd bitcoin-offline-backend
```

#### 2. **Install dependencies**

```bash
npm install
```

#### 3. **Configure environment variables**

Create a `.env` file in the project root:

```ini
# .env
regtest=1
server=1
rpcuser=bitcoin
rpcpassword=secret
rpcallowip=127.0.0.1
rpcport=18443
fallbackfee=0.0002


```

Replace the values with your actual `bitcoind` RPC credentials from `bitcoin.conf`.

#### 4. **Run bitcoind in regtest mode**

Ensure you start `bitcoind` with regtest:

```bash
bitcoind -regtest -daemon
```

Mine some blocks so you have spendable funds:

```bash
bitcoin-cli -regtest generatetoaddress 101 "$(bitcoin-cli -regtest getnewaddress)"
```

#### 5. **Start the backend server**

```bash
node index.js
```

The server will run at:  
🌐 [http://localhost:3001](http://localhost:3001)

---

## 📬 Available API Routes

| Method | Endpoint              | Description                        |
|--------|-----------------------|------------------------------------|
| POST   | `/create-wallet`      | Create a new wallet                |
| GET    | `/get-address/:wallet`| Get a new address from a wallet    |
| GET    | `/get-balance/:wallet`| Get wallet balance                 |
| GET    | `/list-transactions/:wallet` | List wallet transactions   |
| POST   | `/create-tx`          | Create a new PSBT transaction      |
| POST   | `/sign-tx`            | Sign a PSBT transaction            |
| POST   | `/broadcast-tx`       | Broadcast a signed transaction     |

---

## 🧪 Testing RPC connection manually

```bash
curl --user your_rpc_username:your_rpc_password \
     --data-binary '{"jsonrpc":"1.0","id":"curltest","method":"getblockcount","params":[]}' \
     -H 'content-type: text/plain;' \
     http://localhost:18443/
```

---

## 📁 Frontend

The backend is designed to integrate with a React frontend found here:  
👉 `bitcoin-offline-frontend` (coming soon or link to repo)

---

## 🧑‍💻 Author

Built by [@ayomideadeniran](https://github.com/ayomideadeniran)

---

## 📄 License

MIT License