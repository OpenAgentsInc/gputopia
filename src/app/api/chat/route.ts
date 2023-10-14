import { OpenAIStream, StreamingTextResponse } from "ai"
import { getServerSession } from "next-auth"
// import mysql from "mysql2/promise"
import { NextRequest, NextResponse } from "next/server"
import { Configuration, OpenAIApi } from "openai-edge"
import { authOptions } from "@/lib/auth"

// export const runtime = 'edge'

const token = process.env.CRON_AI_TOKEN

const configuration = new Configuration({
  apiKey: token,
  basePath: 'https://queenbee.gputopia.ai/v1'
})

const openai = new OpenAIApi(configuration)

export async function POST(req: NextRequest) {
  // @ts-ignore
  const session = await getServerSession(authOptions)
  if (!session) {
    return new NextResponse('Unauthorized', {
      status: 401
    })
  }

  const json = await req.json()
  const { messages } = json

  const userId = session.user.user_id

  const userBalance = await checkUserBalance(Number(userId))
  console.log(userBalance + ' balance')

  if (userBalance < 7) {
    return NextResponse.json({ error: 'Insufficient balance' })
  }

  const res = await openai.createChatCompletion({
    model: 'vicuna-7B-q4',
    messages,
    max_tokens: 500,
    stream: true
  })

  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      console.log('Successful_completion:', completion)
    }
  })

  return new StreamingTextResponse(stream)
}

async function checkUserBalance(userId: number): Promise<number> {
  try {
    const currentBalance = 10
    return currentBalance
  } catch (err: any) {
    throw new Error('Error fetching balance: ' + err.message)
  }
}

// async function checkUserBalance(userId: number): Promise<number> {
//   // Create MySQL connection
//   const connection = await mysql.createConnection(process.env.DATABASE_URL as string);

//   try {
//     // Check balance without locking the row
//     const [rows] = await connection.execute(
//       'SELECT balance FROM users WHERE id = ?',
//       [userId]
//     ) as any;

//     const currentBalance = rows[0]?.balance || 0;
//     return currentBalance;

//   } catch (err: any) {
//     throw new Error('Error fetching balance: ' + err.message);
//   } finally {
//     await connection.end(); // Close the connection
//   }
// }

// export async function deductUserBalance(userId: number, amount: number): Promise<void> {
//   // Create MySQL connection
//   const connection = await mysql.createConnection(process.env.DATABASE_URL as string);

//   await connection.beginTransaction();
//   try {
//     // Lock the row for the current transaction and check balance
//     const [rows] = await connection.execute(
//       'SELECT balance FROM users WHERE id = ? FOR UPDATE',
//       [userId]
//     ) as any;

//     const currentBalance = rows[0]?.balance || 0;

//     if (currentBalance < amount) {
//       throw new Error('Insufficient balance');
//     }

//     // Deduct balance
//     await connection.execute(
//       'UPDATE users SET balance = balance - ? WHERE id = ?',
//       [amount, userId]
//     );

//     // Commit the transaction
//     await connection.commit();
//   } catch (err: any) {
//     // Rollback in case of an error
//     await connection.rollback();
//     throw new Error('Error deducting balance: ' + err.message);
//   } finally {
//     await connection.end(); // Close the connection
//   }
// }
