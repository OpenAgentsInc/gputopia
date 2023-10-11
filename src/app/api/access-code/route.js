import { NextResponse } from 'next/server'
import mysql from 'mysql2'

const crypto = require('crypto')

function generateRandomHex(n) {
  const randomValues = crypto.randomBytes(n)
  return randomValues.toString('hex')
}

export async function GET(request) {
  const userId = Number(request.cookies.get('userId').value)
  const connection = mysql.createConnection(process.env.DATABASE_URL)
  return new Promise((resolve, reject) => {
    connection.query('SELECT access_token FROM users WHERE id = ?', [userId], function (err, results) {
      connection.end()
      if (err) {
        resolve(NextResponse.json({ error: 'Database error' }))
        return
      }
      resolve(
        NextResponse.json({
          token: results[0].access_token
        })
      )
    })
  })
}

export async function POST(request) {
  const userId = Number(request.cookies.get('userId').value)
  const json = await request.json()
  const connection = mysql.createConnection(process.env.DATABASE_URL)
  const accessToken = generateRandomHex(16)
  if (json.command == 'generate') {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE users SET access_token = ? WHERE id = ?',
        [accessToken, userId],
        function (err, results) {
          connection.end()

          if (err) {
            resolve(NextResponse.json({ error: 'Database error' }))
            return
          }

          resolve(
            NextResponse.json({
              token: accessToken
            })
          )
        }
      )
    })
  }
}
