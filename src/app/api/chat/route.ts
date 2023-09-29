import mysql from "mysql2/promise"
import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { pusher } from "@/lib/pusher"
import { kv } from "@vercel/kv"

export async function POST(req: NextRequest) {
  const json = await req.json();

  // Get the user ID
  const userIdString = req.cookies.get('userId');
  if (!userIdString) {
    throw new Error("Missing user ID cookie");
  }
  const userId = Number(userIdString.value);
  // console.log("Chat from userId:", userId)

  const { messages, id } = json;

  const randomNumberBetweenOneAndTenThousand = Math.floor(Math.random() * 10000) + 1;

  const longerJobId = id + "-" + randomNumberBetweenOneAndTenThousand.toString()

  // Last message sent by the user
  const lastUserMessage = messages.reverse().find((msg: any) => msg.role === 'user');

  if (lastUserMessage) {
    // Check user balance (replace this with actual SQL code)
    const userBalance = await checkUserBalance(userId); // Placeholder function
    console.log(userBalance + " balance")

    if (userBalance >= 7) {
      // Create a job and add it to the Vercel KV queue

      const openai = new OpenAI({ apiKey: `testkey${1}`, baseURL: "https://queenbee.gputopia.ai/v1" });
      // Post to queenbee
      const response = await openai.chat.completions.create({
        model: 'vicuna-v1-7b-q4f32_0',
        stream: true,
        messages
      })


      console.log('response?', response)
      return response

      // const jobObject = { jobId: longerJobId, userId, message: lastUserMessage.content, model: 'Vicuna' }
      // const job = JSON.stringify(jobObject);
      // await kv.rpush('job_queue', job);

      // // Trigger a "new job" event via Pusher to alert model providers
      // pusher.trigger('private-v3jobs', 'new-job', jobObject);
      // // console.log("SENT PUSHER EVENT")

      // // Deduct balance (replace this with actual SQL code)
      // await deductUserBalance(userId, 7); // Placeholder function
    } else {
      return NextResponse.json({ error: 'Insufficient balance' });
    }
  }

  return NextResponse.json("Job queued");
}


async function checkUserBalance(userId: number): Promise<number> {
  // Create MySQL connection
  const connection = await mysql.createConnection(process.env.DATABASE_URL as string);

  try {
    // Check balance without locking the row
    const [rows] = await connection.execute(
      'SELECT balance FROM users WHERE id = ?',
      [userId]
    ) as any;

    const currentBalance = rows[0]?.balance || 0;
    return currentBalance;

  } catch (err: any) {
    throw new Error('Error fetching balance: ' + err.message);
  } finally {
    await connection.end(); // Close the connection
  }
}


// async function deductUserBalance(userId: number, amount: number) {
//   // Deduct user balance in SQL database
//   console.log(`Placeholder: Deducted ${amount} from user ${userId}`)
// }


export async function deductUserBalance(userId: number, amount: number): Promise<void> {
  // Create MySQL connection
  const connection = await mysql.createConnection(process.env.DATABASE_URL as string);

  await connection.beginTransaction();
  try {
    // Lock the row for the current transaction and check balance
    const [rows] = await connection.execute(
      'SELECT balance FROM users WHERE id = ? FOR UPDATE',
      [userId]
    ) as any;

    const currentBalance = rows[0]?.balance || 0;

    if (currentBalance < amount) {
      throw new Error('Insufficient balance');
    }

    // Deduct balance
    await connection.execute(
      'UPDATE users SET balance = balance - ? WHERE id = ?',
      [amount, userId]
    );

    // Commit the transaction
    await connection.commit();
  } catch (err: any) {
    // Rollback in case of an error
    await connection.rollback();
    throw new Error('Error deducting balance: ' + err.message);
  } finally {
    await connection.end(); // Close the connection
  }
}
