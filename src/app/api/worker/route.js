import { NextResponse } from 'next/server'
import mysql from 'mysql2';

export async function POST(request) {
  const json = await request.json();
  let auth_key = json.auth_key
  
  if (!auth_key) {
    const bearer = request.headers.get("Authorization")
    if (bearer && bearer.indexOf(" ")) {
      auth_key = bearer.split(' ')[1]
    }
  }

  if (auth_key != process.env.SPIDER_KEY) {
    return NextResponse.json({error: "No authorization"})
  }

  const connection = mysql.createConnection(process.env.DATABASE_URL)

  const command = json.command

  if (command == "complete") {
    // todo: use the real billing numbers from the spider
    if (json.pay_to_lnurl) {
      let found = await new Promise((resolve, reject) => {
        connection.query(
          'UPDATE users SET balance = balance + 6, total_sats_earned = total_sats_earned + 6 WHERE lightning_address = ?',
          [json.pay_to_lnurl], function (err, results) {
            resolve(1);
          });
      });

      if (!found) {
        await new Promise((resolve, reject) => {
        connection.query(
          'INSERT INTO users (balance, total_sats_earned, lightning_address) VALUES (6, 6, ?)',
          [json.pay_to_lnurl], function (err, results) {
            resolve()
          });
      });
     
      }

    }

    if (json.bill_to_token) {
      await new Promise((resolve, reject) => {
        connection.query(
          'UPDATE users SET balance = balance - 8 WHERE access_token = ?',
          [json.bill_to_token], function (err, results) {
            resolve()
          });
      });
    }
  }

  if (command == "check") {
    // todo: use the real billing numbers from the spider
    let ok = false;
    let user_id = null;
    if (json.bill_to_token) {
        const [results] = await connection.query('SELECT id FROM users WHERE access_token = ? and balance > 5', [json.bill_to_token]);
        if (results.length > 0) {
            user_id = results[0].id;
            ok = true;
        }
    }
    return NextResponse.json({ok, user_id})
  }

  connection.end();
  return NextResponse.json({})
}
