import React, {useEffect, useState} from 'react';
import './styles/App.css';
import {ethers} from "ethers";
import contractAbi from "./utils/contractABI.json";
import polygonLogo from "./assets/polygonlogo.png";
import ethLogo from "./assets/ethlogo.png";
import {networks} from "./utils/networks";

const p2pBankContractAddress = '0x56EE7053b5184eB29bAe5229C80e57b870822C00';

const App = () => {
	//React Hooks to set values for parameters
	const [loanAmount, setLoanAmount] = useState('');
	const [lapseDate, setLapseDate] = useState('');
	const [interest, setInterest] = useState('');
	const [guarantorInterest, setGuarantorInterest] = useState('');
	const [guarantorAddress, setGuarantorAddress] = useState('');
	const [approve, setApprove] = useState(false);
	const [borrower, setBorrower] = useState('');
	const [payBackValue,setPayBackValue] = useState('');
	const [borrowerAddress, setBorrowerAddress] = useState('');
 	const [currentAccount, setCurrentAccount] = useState('');
	const [network, setNetwork] = useState('');
	const [loanRequests, setLoanRequests] = useState([]);
	
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

	// Utility function to Parse loanRequest Mapping to Readable format
	const parseRequest = (request, param) => {
		console.log(request[param]);
		return String(request[param]);
	}
	
	// Smart Contract Functions 
	const requestLoan = async () => {
		try {
			const {ethereum} = window;
			if(ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract(p2pBankContractAddress, contractAbi.abi, signer);
				let tx = await contract.requestLoan(loanAmount*1000, lapseDate, interest*1000);
				const receipt = await tx.wait();
				
				if(receipt.status === 1){
					console.log("Loan Request registered https://mumbai.polygonscan.com/tx/"+tx.hash);	
				}
				else{
					alert("Transaction failed!!!!");
				}
			}
		} catch (error) {
			console.log("ERROR!"+error);
		}
	}

	const guarenteeLoan = async () => {
		try {
		  const { ethereum } = window;
		  if (ethereum) {
			const provider = new ethers.providers.Web3Provider(ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(p2pBankContractAddress, contractAbi.abi, signer);
			let tx = await contract.guarenteeLoan(guarantorInterest*1000,borrower,{value: ethers.utils.parseEther(loanAmount)});
			const receipt = await tx.wait();
			if(receipt.status === 1){
				console.log("Loan request Guarenteed! https://mumbai.polygonscan.com/tx/"+tx.hash);
			}
			else{
				alert("Transaction failed!!!!");
			}
		  }
		} catch(error){
		  console.log(error);
		}
	}

	const approveGuarentee = async () => {
		try {
		  const { ethereum } = window;
		  if (ethereum) {
			const provider = new ethers.providers.Web3Provider(ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(p2pBankContractAddress, contractAbi.abi, signer);
			
			let tx = await contract.approveGuarentee(guarantorAddress, approve);
			const receipt = await tx.wait();
			if(receipt.status === 1){
				console.log("Guaretee status updated! https://mumbai.polygonscan.com/tx/"+tx.hash);
			}
			else{
				alert("Transaction failed!!!!");
			}
		  }
		} catch(error){
		  console.log(error);
		}
	}

	const lendLoan = async () => {
		try {
		  const { ethereum } = window;
		  if (ethereum) {
			const provider = new ethers.providers.Web3Provider(ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(p2pBankContractAddress, contractAbi.abi, signer);
			
			let tx = await contract.lendLoan(borrowerAddress,{value: ethers.utils.parseEther(loanAmount)});
			const receipt = await tx.wait();
			if(receipt.status === 1){
				console.log("Loan lended ! https://mumbai.polygonscan.com/tx/"+tx.hash);
			}
			else{
				alert("Transaction failed!!!!");
			}
		  }
		} catch(error){
		  console.log(error);
		}
	}

	const payBackLoan = async () => {
		try {
		  const { ethereum } = window;
		  if (ethereum) {
			const provider = new ethers.providers.Web3Provider(ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(p2pBankContractAddress, contractAbi.abi, signer);
			
			let tx = await contract.payBackLoan({value: ethers.utils.parseEther(payBackValue)});
			const receipt = await tx.wait();
			if(receipt.status === 1){
				console.log("Loan Payment Suscessfull ! https://mumbai.polygonscan.com/tx/"+tx.hash);
			}
			else{
				alert("Transaction failed!!!!");
			}
		  }
		} catch(error){
		  console.log(error);
		}
	}

	const claimGuarantee = async () => {
		try {
		  const { ethereum } = window;
		  if (ethereum) {
			const provider = new ethers.providers.Web3Provider(ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(p2pBankContractAddress, contractAbi.abi, signer);
			
			let tx = await contract.claimGuarantee(borrowerAddress);
			const receipt = await tx.wait();
			if(receipt.status === 1){
				console.log("Guarentee claimed ! https://mumbai.polygonscan.com/tx/"+tx.hash);
			}
			else{
				alert("Transaction failed!!!!");
			}
		  }
		} catch(error){
		  console.log(error);
		}
	}
	
	//Fetch loan requests from chain
	const fetchLoanRequests = async () => {
		try {
		  const { ethereum } = window;
		  if (ethereum) {
			// You know all this
			const provider = new ethers.providers.Web3Provider(ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(p2pBankContractAddress, contractAbi.abi, signer);
	
			const reqs = await contract.viewAllLoanRequests();
			setLoanRequests(reqs);			
		  }
		} catch(error){
		  console.log(error);
		}
	}

	//Input form for params
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
					<input
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
					/>
					
				</div>
				<div>
					<button className='cta-button mint-button'  onClick={requestLoan}>
					requestLoan
					</button>  
				</div>
				
				<div>
					<button className='cta-button mint-button' onClick={fetchLoanRequests}>
					viewLoanRequests
					</button>  
				</div>
				<div>
				<h2>Loan Requests</h2>
					<table className="card">
					<thead>
						<tr>
						<th>Address</th>
						<th>Loan Amount (finney)</th>
						<th>Interest</th>
						<th>Is Guarenteed</th>
						<th>Lendor Interest</th>
						</tr>
					</thead>
					<tbody>
						{loanRequests.map((req) => {
						return(
							<tr key={parseRequest(req, 5)}>
							<td>{parseRequest(req, 5)}</td>
							<td>{parseRequest(req, 0)}</td>
							<td>{parseRequest(req, 3)}</td>
							<td>{parseRequest(req, 8)}</td>
							<td>{parseRequest(req, 7)}</td>
							</tr>
						);
						})}
					</tbody>
					</table>
				</div>

				<div className="form-container">
				<div className="first-row">
					<input
						type="text"
						value={guarantorInterest}
						placeholder='Enter Guarantor Interest Cut off'
						onChange={e => setGuarantorInterest(e.target.value)}
					/>
					<input
						type="text"
						value={borrower}
						placeholder='Enter borrowerAddress'
						onChange={e => setBorrower(e.target.value)}
					/>
					
					
				</div>
				<div>
					<button className='cta-button mint-button'  onClick={guarenteeLoan}>
					guarenteeLoan
					</button>  
				</div>

				<div className="form-container">
				<div className="first-row">
					<input
						type="text"
						value={guarantorAddress}
						placeholder='Enter Guarantor Address of guarentee'
						onChange={e => setGuarantorAddress(e.target.value)}
					/>
					<input
						type="text"
						value={approve}
						placeholder='Enter approval true or false'
						onChange={e => setApprove(e.target.value)}
					/>
					
					
				</div>
				<div>
					<button className='cta-button mint-button'  onClick={approveGuarentee}>
					approveGuarentee
					</button>  
				</div>
					
				<div className="form-container">
				<div className="first-row">
					<input
						type="text"
						value={borrowerAddress}
						placeholder='Enter borrower address'
						onChange={e => setBorrowerAddress(e.target.value)}
					/>
					
					
					
				</div>
				<div>
					<button className='cta-button mint-button'  onClick={lendLoan}>
					lendLoan
					</button>  
				</div>
				</div>
				<div className="form-container">
				<div className="first-row">
					<input
						type="text"
						value={payBackValue}
						placeholder='Enter Pay Back amount '
						onChange={e => setPayBackValue(e.target.value)}
					/>
					
					
					
				</div>
				<div>
					<button className='cta-button mint-button'  onClick={payBackLoan}>
					payBackLoan
					</button>  
				</div>
				</div>

				<div className="form-container">
				<div className="first-row">
					<input
						type="text"
						value={borrowerAddress}
						placeholder='Enter borrower address'
						onChange={e => setBorrowerAddress(e.target.value)}
					/>
					
					
					
				</div>
				<div>
					<button className='cta-button mint-button'  onClick={claimGuarantee}>
					claimGuarantee
					</button>  
				</div>
				</div>
				

			</div>
				

			</div>
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

	return(
		<div className="App">
				<div className="container">

					<div className="header-container">
						<header>
							<div className="left">
								<p className="title">P2P Bank</p>
								<p className="subtitle">DLT5401 Assignmnet</p>
								<p className="subtitle">A peer to peer lending and borrowing service facilitated by smart contract on a blockchain </p>
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