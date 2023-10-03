"use client"
// export const runtime = 'edge'

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { BackgroundImage } from '@/components/background-image';
import Link from 'next/link';

export default function AccessTokenPage() {
  const [token, setToken] = useState(null);
  const [showToken, setShowToken] = useState(false);

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
