"use client"
// export const runtime = 'edge'

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input';
import { BackgroundImage } from '@/components/background-image';
import Link from 'next/link';

const LN_ADDRESS = 'simul@getalby.com'

export default function AccessTokenPage() {
  const [token, setToken] = useState(null);
  const [showToken, setShowToken] = useState(false);
  const [amount, setAmount] = useState("");
  
  function copyToClipboard() {
    if (token)
      navigator.clipboard.writeText(token);
  }

  useEffect(function() {
    async function fetchToken() {
      try {
        const response = await fetch('/api/access-code');
        const data = await response.json();
        if (data && data.token) {
          setToken(data.token);
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    }

    fetchToken();
  }, []);

  async function verifyPaid(info: any): Promise<void> {
    try {
      const response = await fetch('/api/verify-paid', {method: "POST", body: JSON.stringify({
        invoice: info.pr,
        verify: info.verify,
      })});
      const data = await response.json();
      if (data && data.token) {
        setToken(data.token);
      }
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  }

  async function generateToken() {
    try {
      const response = await fetch('/api/access-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ command: "generate" })
      });
      const data = await response.json();
      if (data && data.token) {
        setToken(data.token);
      }
    } catch (error) {
      console.error("Error generating token:", error);
    }
  }
 
  return (
        <div className="p-5 pt-24">
          <BackgroundImage />
          
          <h1 className='text-2xl fond-bold mb-4'>
          Top up balance
          </h1>

          <div className="flex items-center space-x-4">
          <Input
            value={amount}
            placeholder="Amount in sats"
            onChange={e => setAmount(e.target.value)}
            className='p2 w-40'
          />

          <Button
                style={{
                  padding: 4,
                  paddingLeft: 10,
                  paddingRight: 10,
                  borderRadius: 8,
                  textAlign: "left",
                  marginBottom: 2,
                  marginTop: 6,
                  color: "#999",
                  fontSize: 14,
                }}
                onClick={async () => {
                  if (!window.webln) {
                    alert("Please install a Lightning wallet like Alby");
                    return;
                  }
                  await window.webln.enable();

                  const [user, host] = LN_ADDRESS.split('@');
                  const url = `https://${host}/.well-known/lnurlp/${user}`;
                  const response = await fetch(url);
                  const lnurlDetails = await response.json();
                  console.log("deets", lnurlDetails)
                  const callback = new URL(lnurlDetails.callback);
                  const sats = parseInt(amount) * 1000; // lnurl-pay requires milli-sats
                  
                  callback.searchParams.set('amount', sats.toString());

                  console.log("callback", callback)
                  const callbackResponse = await fetch(callback.toString());
                  console.log("resp", callbackResponse)
                  const prDetails = await callbackResponse.json();

                  console.log("prd", prDetails)

                  const invoice = prDetails.pr;
                  
                  if (!prDetails.verify) {
                    prDetails.verify = `https://${host}/.well-known/lnurlp/${user}/verify`;
                  }

                  const {preimage} = await window.webln.sendPayment(invoice);
                  
                  if (!!preimage) {
                   await verifyPaid(prDetails)
                  }
                }}
              >
                Pay {amount} {amount === "1" ? "sat" : "sats"}
          </Button>
          </div>

          Using lighning minimizes risk and cost for us. If you would like to pay another way please <Link href="mailto:info@gputopia.ai">email us</Link>.

          <h1 className='text-2xl fond-bold mb-4'>
          Access Token
          </h1>
          
          <p className='mb-6'>
          Use this as the API Key when using our endpoint in python or node.   You can read more on how to 
          <Link href="/docs/buying" className="text-blue-500 hover:underline"> configure this here
          </Link>.
          </p>

          {token && (
          <div className="flex items-center space-x-4">
          {showToken ? (
            <span className='border p-2'>{token}</span>
          ) : (
            <span className='border p-2'>******</span>
          )}
          <Button onClick={copyToClipboard}>📋</Button>
          <Button onClick={() => setShowToken(!showToken)}>
            {showToken ? "Hide" : "Click to Reveal"}
          </Button>
          </div>
          )}
          <div className="mt-4">
        <Button onClick={generateToken}>Generate New Token</Button>
          </div>
        </div>
  );
}
