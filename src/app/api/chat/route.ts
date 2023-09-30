import { OpenAIStream, StreamingTextResponse } from "ai"
// import mysql from "mysql2/promise"
import { NextRequest, NextResponse } from "next/server"
import { Configuration, OpenAIApi } from "openai-edge"

export const runtime = 'edge'

const configuration = new Configuration({
  apiKey: `testkey${1}`,
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
    // model: 'TheBloke/WizardLM-7B-uncensored-GGML:q4_K_M',
    // model: 'meta-llama/Llama-2-70b-chat-hf:q4_K_M',
    model: "TheBloke/CodeLlama-13B-Instruct-GGUF:Q5_K_M",
    // model: "TheBloke/Llama-2-70B-chat-GGUF:Q5_K_M",
    messages,
    max_tokens: 500,
    stream: true
  })

  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      console.log("Successful_completion:", completion)
    }
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
