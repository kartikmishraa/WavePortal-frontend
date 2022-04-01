import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./util/WavePortal.json";
import "./App.css";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = "0xC43EED7F5345C9542B1dF6C661d6aA2489c41d5D";
  const contractABI = abi.abi;

//   const getAllWaves = async () => {
//   const { ethereum } = window;

//   try {
//     if (ethereum) {
//       const provider = new ethers.providers.Web3Provider(ethereum);
//       const signer = provider.getSigner();
//       const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
//       const waves = await wavePortalContract.getAllWaves();

//       const wavesCleaned = waves.map(wave => {
//         return {
//           address: wave.waver,
//           timestamp: new Date(wave.timestamp * 1000),
//           message: wave.message,
//         };
//       });

//       setAllWaves(wavesCleaned);
//     } else {
//       console.log("Ethereum object doesn't exist!");
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

// /**
//  * Listen in for emitter events!
//  */
// useEffect(() => {
//   let wavePortalContract;

//   const onNewWave = (from, timestamp, message) => {
//     console.log("NewWave", from, timestamp, message);
//     setAllWaves(prevState => [
//       ...prevState,
//       {
//         address: from,
//         timestamp: new Date(timestamp * 1000),
//         message: message,
//       },
//     ]);
//   };

//   if (window.ethereum) {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();

//     wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
//     wavePortalContract.on("NewWave", onNewWave);
//   }

//   return () => {
//     if (wavePortalContract) {
//       wavePortalContract.off("NewWave", onNewWave);
//     }
//   };
// }, []);


  // ----------------------------------------------------------------------------

  
  const getAllWaves = async () => {
      const { ethereum } = window;
    
    try {
      if (!ethereum) {
        console.log("Get MetaMask!");
        return;
      }
      
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = await provider.getSigner();
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

      const waves = await wavePortalContract.getAllWaves();
      
      let wavesCleaned = [];
      for (const wave of waves) {
        wavesCleaned.push({
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000), 
          message: wave.message
        });
      }

      setAllWaves(wavesCleaned); 
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    let wavePortalContract;

    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
        
      setAllWaves(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      wavePortalContract.on("NewWave", onNewWave);
    }

    return () => {
      if (wavePortalContract) {
      wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, []);
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);

        await getAllWaves();
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = await provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const _msg = document.getElementById("input-el").value;
        
        const waveTxn = await wavePortalContract.wave(_msg, {gasLimit: 300000});
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined --", waveTxn.hash);
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  const getWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = await provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const count = await wavePortalContract.getTotalWaves();
        const countNum = count.toNumber();
        const countString = "Total Waves: " + countNum;
        alert(countString);
      } else {
        alert("Ethereum object does not exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  console.log(allWaves[0]);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
          Kartik here, I have created this frontend to connect to my Smart Contract deployed on the Rinkeby Testnet (Ethereum). 
<br /> <strong>Go ahead and say hi! </strong>
        </div>
  
        <input type="text" className="form-txt" id="input-el"/> 
  
        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        <button className="waveButton" onClick={getWaves}> 
          Show Total Waves
        </button>

        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Sender's Address: {wave.address}</div>
              <div>Message: {wave.message}</div>
              <div>Time: {wave.timestamp.toString()}</div>
            </div>)
        })}
      </div>
    </div>
  );
}

export default App