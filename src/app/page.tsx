'use client'

import { doSignInBackend, doSignUpBackend, getProfileBackend } from "@/services/backend-fake";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

export default function Home() {
  const [error, setError] = useState('');
  const [wallet, setWallet] = useState('');
  const [profile, setProfile] = useState<{name: string}>({} as {name: string});
  const [balance, setBalance] = useState('');


  useEffect(() => {
  const address = localStorage.getItem('wallet');
  if(address) {
    setWallet(address);
    doSignIn();
  }
}, [])

async function connect() {
  setError('');
 
  if (!window.ethereum) return setError(`No MetaMask found!`);
 
  const provider = new ethers.BrowserProvider(window.ethereum);
  const accounts = await provider.send("eth_requestAccounts", []);
  if (!accounts || !accounts.length) return setError('Wallet not found/allowed!');
 
  localStorage.setItem('wallet', accounts[0]);
 
  setWallet(accounts[0]);
 
  console.log(process.env.NEXT_PUBLIC_CHALLENGE)
  const message = process.env.NEXT_PUBLIC_CHALLENGE ? String(process.env.NEXT_PUBLIC_CHALLENGE) : ''
  const signer = await provider.getSigner();
  const secret = await signer.signMessage(message);
  console.log('dladpadoka')
  console.log(secret)
 
  return { user: accounts[0], secret };
}

function doSignUp() {
  connect()
    .then(credentials => {
      if(credentials) {
        return doSignUpBackend(credentials)
      }
    })
    .then(result => {
      if(result) {
        localStorage.setItem('token', result.token)
      }
    })
    .catch(err => setError(err.message))
}

function doSignIn() {
  connect()
    .then(credentials => {
      if(credentials) {
        return doSignInBackend(credentials)
      }
    })
    .then(result => {

      if(result) {
        localStorage.setItem('token', result.token);
        loadProfile(result.token);
      }
    })
    .catch(err => setError(err.message))
}


function doLogout(){
  localStorage.removeItem('wallet');
  setWallet('');
  setError('');
}


async function loadProfile(token: string) {
  const profile = await getProfileBackend(token)
  setProfile(profile);
}

function getBalance() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  provider.getBalance(wallet)
    .then(balance => setBalance(ethers.formatEther(balance.toString())))
    .catch(err => setError(err.message))
}

  return (
    <div className="App">
    <header className="App-header">
      <h1>Login</h1>
      <div>
        {
          !wallet
            ? (
              <>
                <button onClick={doSignIn}>
                  Sign In with MetaMask
                </button>
                <button onClick={doSignUp}>
                  Sign Up with MetaMask
                </button>
              </>
            )
            : (
              <>
                <p>
                  Wallet: {wallet}
                </p>
                <p>
                  Name: {profile.name}
                </p>
                <p>
                  <button onClick={getBalance}>
                    See Balance
                  </button> {balance}
                </p>
                <button onClick={doLogout}>
                  Logout
                </button>
              </>
            )
        }
        {
          error ? <p>{error}</p> : <></>
        }
      </div>
    </header>
  </div>
  )
}
