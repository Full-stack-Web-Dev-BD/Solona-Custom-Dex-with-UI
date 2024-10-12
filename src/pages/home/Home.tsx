import React, { useEffect, useState } from 'react'
import "./home.css"
import { GoDotFill } from "react-icons/go";
import { PiUserCircleLight } from "react-icons/pi";
import { FaArrowRightLong } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineSwap } from "react-icons/ai";
import { FaEthereum } from "react-icons/fa";
import axios from 'axios';
import Solflare from '@solflare-wallet/sdk';
import { Connection, Transaction, VersionedTransaction } from '@solana/web3.js';
import { Buffer } from 'buffer'

const rpc = "https://rpc-mainnet.solanatracker.io/?api_key=e891a957-8d59-4888-89fe-8ee2109a3f2a"



const Home = () => {
    const [walletAddress, setWalletAddress] = useState("")
    const wallet: any = new Solflare();

    useEffect(() => {
        wallet.on('connect', () => {
            setWalletAddress(wallet.publicKey.toString());
        });
        wallet.on('disconnect', () => {
            setWalletAddress('')
            console.log('disconnected');
        });
    })

    const connectWallet = async () => {
        await wallet.connect();
    }

    const doSwap = async () => {
        const connection = new Connection(rpc);

        var res
        try {
            res = (await axios.get("https://swap-v2.solanatracker.io/swap?from=So11111111111111111111111111111111111111112&to=4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R&fromAmount=1&slippage=10&payer=72H7tD4oeUVpqVPGnjDP5pn34ApTbUXccCyg4TPMk1Yb")).data
        } catch (error) {
            alert("error")
        }
        const instructions =
        {
            ...res,
            txn: res.txn,
            rate: res.rate,
            fromToken: "So11111111111111111111111111111111111111112",
            toToken: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
            amount: 0.0002,
            slippage: 10,
            priorityFee: 0.0005, // Priority fee,

        }


        // The signer is the payer's public key (in this case, the person initiating the swap)
        const signers = [walletAddress];

        // Return the instructions and signers to be used later
        var ins = {
            ...instructions,
            signers: signers
        };
        try {
            // console.log(res)
            // Loading the Transaction
            const serializedTransactionBuffer = Buffer.from(ins.txn, "base64");
            let txn;
            if (res.type === 'v0') {
                txn = VersionedTransaction.deserialize(serializedTransactionBuffer);
            } else {
                txn = Transaction.from(serializedTransactionBuffer);
            }

            if (!txn) return false;
            await wallet.connect();
            const signedTransaction: Transaction = await wallet.signTransaction(txn);
            console.log("signedTransaction", signedTransaction)
            const srTx= signedTransaction.serialize()
            console.log("Check", srTx)
            // Sending the Transaction Using React Wallet Adapter
            var txid = await connection.sendRawTransaction(srTx, {
                skipPreflight: true,
              });
              console.log(" txn swap ", txn, txid)            // await wallet.connect()
            // if (res.type === 'v0' && txn) {
            //     await wallet.signAndSendTransaction(txn);
            // }

            // const txid = await wallet.signAndSendTransaction(txn, connection, {
            //     skipPreflight: true,
            //     maxRetries: 4,
            // });
            // console.log(txid)

        } catch (error) {
            console.log(error)
        }



    }


    return (
        <div className='container'>
            <div className='top_bar'>
                <div className="left_menu">
                    <ul>
                        <li> <span className='active'> Exchange</span></li>
                        <li>Liquidity</li>
                        <li>Mining</li>
                        <li>Developer</li>
                    </ul>
                </div>
                <div className='right_menu'>
                    <div className='_user'><PiUserCircleLight /></div>
                    <div className="_scan">
                        <div className="custom_badge"> <span><GoDotFill /></span> BSC</div>
                    </div>
                    <div className="connect_wallet">
                        {
                            walletAddress ?
                                <button className='btn'>
                                    Connected: {walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : ''}
                                </button>
                                :
                                <button className='btn ' onClick={e => connectWallet()}>Connect to a Wallet</button>

                        }
                    </div>
                </div>
            </div>

            <div className='swap_content'>
                <div className="row" style={{ alignItems: 'center' }}>
                    <div className="col-md-6">
                        <div className='_heading'>
                            <h5>Welcome to</h5>
                            <h2>Pinky Swap</h2>
                            <h2>Cryptocurrency</h2>
                            <h2>Exchange</h2>
                        </div>

                        <p className='mt-4'> Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur est debitis sunt deserunt odit vitae, odio, repudiandae autem tempore porro, nesciunt necessitatibus eaque perferendis dolores dicta recusandae laboriosam esse corrupti! </p>
                        <button className='btn '  > Let's Start <span><FaArrowRightLong /></span> </button>

                    </div>
                    <div className="col-md-6">
                        <div className="swap_wrap">
                            <div className="swap_box">
                                <div className="swap_box_content">
                                    <div className="_line"></div>
                                    <div className="overlay_box">
                                    </div>
                                    <div className='swap_toggle'>
                                        <AiOutlineSwap />
                                    </div>
                                    <div className="s_left">
                                        <div className="_coin">
                                            <span className='coin_icon'><FaEthereum /></span>
                                            <span className="coin_token_name"> SOL</span>
                                        </div>

                                        <div className='select_coin'>
                                            <span>SOLONA</span>
                                            <span><IoIosArrowDown /></span>
                                        </div>
                                        <div className="sp"></div>
                                        <h6>You Sent </h6>
                                        <input className='form-control' value={"0.0021"} />
                                    </div>
                                    <div className="s_right">
                                        <div className="_coin">
                                            <span className='coin_icon'><FaEthereum /></span>
                                            <span className="coin_token_name"> SOL</span>
                                        </div>
                                        <div className='select_coin'>
                                            <span>SOLONA</span>
                                            <span><IoIosArrowDown /></span>
                                        </div>
                                        <div className="sp"></div>
                                        <h6>You Receive </h6>
                                        <input className='form-control' value={"0.0021"} />
                                    </div>
                                </div>
                                <div className='mt-5'>
                                    <p>Available Funds : <span>0.002 Ray</span></p>
                                    <p>1 Ray = 0.023 SOL</p>

                                    <button onClick={e => { doSwap() }} className='btn btn-block swap_btn'>Swap</button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Home