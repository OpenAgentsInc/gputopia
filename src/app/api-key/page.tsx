'use client'
// export const runtime = 'edge'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { BackgroundImage } from '@/components/background-image'
import { Button } from '@/components/ui/button'

export default function AccessTokenPage() {
  const [token, setToken] = useState(null)
  const [showToken, setShowToken] = useState(false)

  function copyToClipboard() {
    if (token) navigator.clipboard.writeText(token)
  }

  useEffect(function () {
    async function fetchToken() {
      try {
        const response = await fetch('/api/access-code')
        const data = await response.json()
        if (data && data.token) {
          setToken(data.token)
        }
      } catch (error) {
        console.error('Error fetching token:', error)
      }
    }

    fetchToken()
  }, [])

  async function generateToken() {
    try {
      const response = await fetch('/api/access-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ command: 'generate' })
      })
      const data = await response.json()
      if (data && data.token) {
        setToken(data.token)
      }
    } catch (error) {
      console.error('Error generating token:', error)
    }
  }

  return (
    <div className="p-5 pt-24 flex flex-col justify-center items-center">
      <BackgroundImage />

      <div className="md:w-2/3 px-6">
        <h1 className="text-2xl fond-bold mb-4">API Key</h1>

        <p>Your secret API key is listed below.</p>

        <p className="mt-4">
          Do not share your API key with others, or expose it in the browser or other client-side code. In
          order to protect the security of your account, GPUtopia may also automatically disable any API key
          that we&apos;ve found has leaked publicly.
        </p>

        <p className="mt-4 mb-6">
          Use this as the API Key when using our endpoint. Read how to{' '}
          <Link href="/docs/buying" className="text-cyan-500 hover:underline">
            configure this here
          </Link>
          .
        </p>

        {token && (
          <div className="flex items-center space-x-4">
            <Button onClick={() => setShowToken(!showToken)} className="w-24">
              {showToken ? 'Hide' : 'Reveal'}
            </Button>
            {showToken ? (
              <span className="border p-2 w-96">{token}</span>
            ) : (
              <span className="border p-2 w-96">*********</span>
            )}
            <Button onClick={copyToClipboard}>📋</Button>
          </div>
        )}
        <div className="mt-12 flex flex-row items-center">
          <Button variant="destructive" onClick={generateToken}>
            Generate New Token
          </Button>
          <p className="ml-4 italic">This will make all previous tokens stop working.</p>
        </div>
      </div>
    </div>
  )
}
