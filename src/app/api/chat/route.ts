import { OpenAIStream, StreamingTextResponse } from "ai"
import { nanoid } from "nanoid"
import { NextRequest, NextResponse } from "next/server"
import { Configuration, OpenAIApi } from "openai-edge"
import { kv } from "@vercel/kv"

export const runtime = 'edge'

const token = "ac4a9ce1c028c7a1e652d11f4d7e009e"
// process.env.CRON_AI_TOKEN

const configuration = new Configuration({
  apiKey: token,
  basePath: "https://queenbee.gputopia.ai/v1"
})

const openai = new OpenAIApi(configuration)

export async function POST(req: NextRequest) {
  const json = await req.json();
  const { messages } = json;

  // Get the user ID
  const userIdString = req.cookies.get('userId');
  if (!userIdString) {
    throw new Error("Missing user ID cookie");
  }
  const userId = Number(userIdString.value);

  // Check user balance
  const userBalance = await checkUserBalance(userId);
  console.log(userBalance + " balance")

  if (userBalance < 7) {
    return NextResponse.json({ error: 'Insufficient balance' });
  }

  const res = await openai.createChatCompletion({
    model: "vicuna-7B-q4",
    messages,
    max_tokens: 500,
    stream: true
  })

  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      const title = json.messages[0].content.substring(0, 100)
      const id = json.id ?? nanoid()
      const createdAt = Date.now()
      const path = `/chat/${id}`
      const payload = {
        id,
        title,
        userId,
        createdAt,
        path,
        messages: [
          ...messages,
          {
            content: completion,
            role: 'assistant'
          }
        ]
      }
      await kv.hmset(`chat:${id}`, payload)
      await kv.zadd(`user:chat:${userId}`, {
        score: createdAt,
        member: `chat:${id}`
      })
    }
    // async onCompletion(completion) {
    //   console.log("Successful_completion:", completion)
    //   const createdAt = Date.now()
    //   const id = nanoid()

    //   await kv.zadd(`user:chat:${userId}`, {
    //     score: createdAt,
    //     member: `chat:${id}`
    //   })
    //   console.log(`Created chat: ${id} for user: ${userId}`)
    // }
  })

  return new StreamingTextResponse(stream)
}

async function checkUserBalance(userId: number): Promise<number> {
  try {
    const currentBalance = 10
    return currentBalance;
  } catch (err: any) {
    throw new Error('Error fetching balance: ' + err.message);
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
