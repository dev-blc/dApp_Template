# Solidity dApp Template

A Boilerplate for solidity dApps for EVM-based networks. Straightforward and basic implementation to get started on coding solidity-based dApps easily. 

## Using the template
### Setup 

Clone the repository to your preferred directory.

```bash
git clone https://github.com/dev-blc/dApp_Template.git
```
### Network Configuration - Hardhat
We are using [Hardhat](https://hardhat.org) as our Ethereum environment.
Make sure to install the node modules to run hardhat successfully. 
```bash
npm install
```
Hardhat environment creates a private default blockchain network for you to deploy and test your code. But using a testnet for deployment and testing is suggested. The network configuration for Polygon Mumbai Testnet is mentioned in the "hardhat.config.js" file. Please add the configuration of your desired testnet in the same file. Use a dotenv file to hold your metamask private key and Alchemy API key. Alchemy is our blockchain provider which will provide RPC endpoints for our dApp to connect with.

### Smart Contract

Paste your solidity smart contract in the "contracts" folder inside the "network" folder. Make the required changes to the "deploy.js" file, in the "scripts" folder to deploy your smart contract successfully. Add your testing file inside the "test" folder. Testing is strongly recommended, please refer to the "lock.js" test file for syntax and sample. 

### Compile and Deploy your Smart Contract
Perform the below steps to compile and deploy your smart contract
```bash
npx hardhat compile 
npx hardhat run --network <your-network> scripts/deploy.js
```
The above commands will compile and deploy the smart contracts to your preferred network. Make sure to use the same network identifier as mentioned in the hardhat config file.

### Run your dApp locally
The below command will start your localhost server with the dApp running on it.
```bash
npm start
```
Make sure to paste your smart contract ABI from the "networks/artifacts" folder and paste it into the "contractABI.json" file in the "src/utils" folder. Replace the placeholder value with your contract address to the "contractAddress" variable.
Add specific function calls and input forms for your variables as per your requirements. You can monitor the changes you make on the localhost server page in your browser.
Make changes to the UI/UX components as per your requirements.


## DISCLAIMER
THIS IS JUST A SAMPLE OR TEMPLATE IMPLEMENTATION PLEASE MAKE SURE TO EDIT THE CODE TO YOUR PREFERENCE. ONLY FOR TESTNET PURPOSES AND EDUCATIONAL PURPOSES. IM A NOOB SO THE CODE IS NOT TESTED AND EFFICIENT. 
## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

