import React, {useEffect, useState} from 'react';
import './styles/App.css';
import {ethers} from "ethers";
import contractAbi from "./utils/contractABI.json";
import polygonLogo from "./assets/polygonlogo.png";
import ethLogo from "./assets/ethlogo.png";
import {networks} from "./utils/networks";

const contractAddress = 'PASTE_YOUR_DEPLOYED_AMRT_CONTRACT_ADDRESS_HERE';

const App = () => {
	//React Hooks to set values for parameters
	//ADD REACT HOOKS FOR YOUR PARAMETER VALUES THAT YOU NEED TO PASS TO YOUR SOLIDITY CONTRACT FUNCTION CALL
	const [network, setNetwork] = useState('');
	const [currentAccount, setCurrentAccount] = useState('');
	const [loanAmount, setLoanAmount] = useState('');
	//Pre Requisites - Wallet connection and check 
	const connectWallet = async() => {
		try{
			const{ethereum} = window;
			if(!ethereum){
				alert("Install MetaMask -- https://metamask.io/");
				return;
			}
			const accounts = await ethereum.request({method: 'eth_requestAccounts'});
			console.log("Connected to - ",accounts[0]);
			setCurrentAccount(accounts[0]);
		}catch(err){
			console.log("!!!Error!!!-",err);
		}
	}

	const checkWalletConnected = async ()=>{
		const{ethereum} = window;

		if(!ethereum) {
			console.log("Please install metamask!!");
			return;
		}
		else{
			console.log("Available ethereum object - ", ethereum);
		}

		const accounts = await ethereum.request({method: 'eth_accounts'});
		if (accounts.length !== 0) {
			const account = accounts[0];
			console.log('Found an authorized account:', account);
			setCurrentAccount(account);
		} else {
			console.log('No authorized account found');
		}

		const chainId = await ethereum.request({method: 'eth_chainId'});
		setNetwork(networks[chainId]);
		ethereum.on('Chain Changed',handleChainChanged);
		function handleChainChanged(_chainId) {
			window.location.reload();
		}
	}
	
	const renderNotConnected = () => (
		<div className="connect-wallet-container">
				<button onClick={connectWallet} className="cta-button connect-wallet-button" >
					Connect Wallet
				</button>
    	</div>
	);

	
	// Smart Contract Functions 
	// ADD YOUR RESPECTIVE SMART CONTRACT FUNCTIONS AS SEPERATE FUNCTIONS 
	// BELOW FUNCTIONS ARE FOR REFRENCE AND PLACE HOLDERS 
	// FORMAT FOR SENDING ETHERS ALONG THE TXN IS ALSO ADDED IN BELOW CODE 
	const functionName = async () => {
		try {
			const {ethereum} = window;
			if(ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract(contractAddress, contractAbi.abi, signer);
				let tx = await contract.functionName('ADD_FUNCTION_PARAMETRS');
				const receipt = await tx.wait();
				
				if(receipt.status === 1){
					console.log("PRINT TXN DETAILS https://mumbai.polygonscan.com/tx/"+tx.hash);	
				}
				else{
					alert("Transaction failed!!!!");
				}
			}
		} catch (error) {
			console.log("ERROR!"+error);
		}
	}

	const functionWithEthers = async () => {
		try {
		  const { ethereum } = window;
		  if (ethereum) {
			const provider = new ethers.providers.Web3Provider(ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(contractAddress, contractAbi.abi, signer);
			let tx = await contract.functionWithEthers('ADD_YOUR_FUNCTION_PARAMETRS_HERE',{value: ethers.utils.parseEther("ADD_AMOUNT_TO_BE_SENT_HERE")});
			const receipt = await tx.wait();
			if(receipt.status === 1){
				console.log("PRINT TXN DETAILS https://mumbai.polygonscan.com/tx/"+tx.hash);
			}
			else{
				alert("Transaction failed!!!!");
			}
		  }
		} catch(error){
		  console.log(error);
		}
	}
	
	// ADD FUNCTIONS AS PER YOUR SMART CONTRACT USING THE ABOVE FORMAT
	

	//Input form for params
	// THIS FUNCTION IS USED TO CREATE A FORM OF INPUT PARAMS THAT NEED TO BE PASSED TO THE SMART CONTRACT 
	// THE USER SHOULD ENTER THE VALUES THAT NEEDS TO BE PASSED TO THE SMART CONTRACT
	const renderInputForm = () => {
		if (network !== 'Polygon Mumbai Testnet') {
			return (
			<div className="connect-wallet-container">
				<p>Please switch to the Polygon Mumbai Testnet</p>
				<button className='cta-button mint-button' onClick={switchNetwork}>Click here to switch</button>
			</div>
			);
		}
		return(
			<div className="form-container">
				<div className="first-row">
					<input
						type="text"
						value={loanAmount}
						placeholder='Enter Loan Amount (Will be calculated as finney) '
						onChange={e => setLoanAmount(e.target.value)}
					/>
					{/* USER CAN ADD THE SAME FORMAT OF INPUT FOR ALL OTHER VARIABLES */}
					{/* <input
						type="text"
						value={interest}
						placeholder='Enter Interest'
						onChange={e => setInterest(e.target.value)}
					/>
					<input
						type="text"
						value={lapseDate}
						placeholder='Enter loan repayment date in no of days format'
						onChange={e => setLapseDate(e.target.value)}
					/> */}
					
				</div>
				<div>
					<button className='cta-button mint-button'  onClick={functionWithEthers}>
					functionWithEthers
					</button>  
				</div>
				
				{/* <div>
					<button className='cta-button mint-button' onClick={fetchLoanRequests}>
					viewLoanRequests
					</button>  
				</div> */}
			
		{/* USER CAN ADD THE SAME FORMAT OF INPUT FOR ALL OTHER FUNCTIONS */}
				</div>

				

		);
	}

	//Switch to polygon mumbai network
	const switchNetwork = async () => {
		if (window.ethereum) {
		  try {
			// Try to switch to the Mumbai testnet
			await window.ethereum.request({
			  method: 'wallet_switchEthereumChain',
			  params: [{ chainId: '0x13881' }], // Check networks.js for hexadecimal network ids
			});
		  } catch (error) {
			// This error code means that the chain we want has not been added to MetaMask
			// In this case we ask the user to add it to their MetaMask
			if (error.code === 4902) {
			  try {
				await window.ethereum.request({
				  method: 'wallet_addEthereumChain',
				  params: [
					{	
					  chainId: '0x13881',
					  chainName: 'Polygon Mumbai Testnet',
					  rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
					  nativeCurrency: {
						  name: "Mumbai Matic",
						  symbol: "MATIC",
						  decimals: 18
					  },
					  blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
					},
				  ],
				});
			  } catch (error) {
				console.log(error);
			  }
			}
			console.log(error);
		  }
		} else {
		  // If window.ethereum is not found then MetaMask is not installed
		  alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
		} 
	}

	useEffect(()=>{
		checkWalletConnected();
	},[]);
	// HERE YOU MENTION TEH DESCTRIPTION AND THE TITLE OF THE PAGE THAT APPEARS BEFORE THE FORM
	return(
		<div className="App">
				<div className="container">

					<div className="header-container">
						<header>
							<div className="left">
								<p className="title">dApp_Template</p>
								</div>
							<div className="right">
      							<img alt="Network logo" className="logo" src={ network.includes("Polygon") ? polygonLogo : ethLogo} />
      							{ currentAccount ? <p> Wallet: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)} </p> : <p> Not connected </p> }
    						</div>
						</header>
					</div>

					{!currentAccount && renderNotConnected()}
					{currentAccount && renderInputForm()}
				</div>
			</div>
	)
}
export default App;