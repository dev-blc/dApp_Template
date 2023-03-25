require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",

  networks: {
    // Activate your preffered network by un-commenting them 
    // mumbai - Polygon Mumbai Testnet
    // Add your metamask private key and Alchemy API key in ".env" file with the below variable names 
    mumbai: {
      url: process.env.ALCHEMY_KEY,
      accounts: [process.env.PRIVATE_KEY],
    }

    
  }
};
