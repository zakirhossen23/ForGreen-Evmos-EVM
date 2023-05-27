import Web3 from 'web3'

import erc721 from '../contract/deployments/evmos/ForGreen.json';

export default function ERC721Singleton(signer) {
	const web3 = new Web3(window.ethereum)
  
	// create an instance of the KeyManager
	const myKM = new web3.eth.Contract(erc721.abi, erc721.address).methods
  
	return myKM
  }
  