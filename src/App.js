import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import SelectCharacter from './Components/SelectCharacter';
import Arena from './Components/Arena';
import LoadingIndicator from './Components/LoadingIndicator';
import { CONTRACT_ADDRESS, transformCharacterData } from './constants';
import Game from './utils/Game.json';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {

  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkIfWalletIsConnected = async () => {

    const { ethereum } = window;

    if(!ethereum) {
      console.log('Make sure you have Metamask!');
      return;
    } else {
      console.log('We have the ethereum object', ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found and Authorized account:", account);
      setCurrentAccount(account)
      
    } else {
      setIsLoading(false) 
      console.log("not authorized account found")
    }
  }
  
  const renderContent = () => {
    //if loading
    if (isLoading) {
      return <LoadingIndicator />;
    }

    //scenario 1
    if (!currentAccount) {
      return(
        <div className="connect-wallet-container">
        <img
          src="https://m.media-amazon.com/images/M/MV5BZTA2OTM5YWQtOTliMS00YjFhLTliNDktZTU5Njk3MmEzMTM3XkEyXkFqcGdeQXRyYW5zY29kZS13b3JrZmxvdw@@._V1_QL75_UX500_CR0,0,500,281_.jpg"
          alt="Avengers"
        />
        <button className="cta-button connect-wallet-button" onClick={connectWallet}>
          Connect Wallet To Get Started
        </button>
       </div>
      );

    //scenario 2
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    } else if (currentAccount && characterNFT) {
      return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT}  />;
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get Metamask");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      } catch (error) {
      console.log(error)
      }
  }

  useEffect(() => {  //wallet connected
    /*
     * Anytime our component mounts, make sure to immiediately set our loading state
     */
    setIsLoading(true);
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {   //fetch nft data
    const fetchNFTMetadata = async () => {
      console.log("Checking for Character NFT on address", currentAccount);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(CONTRACT_ADDRESS, Game.abi, signer);

      const txn = await gameContract.checkIfUserHasNFT();
      if (txn.name) {
        console.log('User has character NFT');
        setCharacterNFT(transformCharacterData(txn));
      }  else {
        console.log('No Character Found');
      }

      /*
      * Once we are done with all the fetching, set loading state to false
      */
      setIsLoading(false);
    };

    if (currentAccount) {
      console.log('CurrentAccount:', currentAccount);
      fetchNFTMetadata();
    }

  }, [currentAccount]);



  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Ultron Slayer ⚔️</p>
          <p className="sub-text">Team up to protect the Metaverse! Disney, don't sue me!</p> 
            {renderContent()}
        </div>

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
