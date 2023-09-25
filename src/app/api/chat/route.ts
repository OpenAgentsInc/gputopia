import { NextRequest, NextResponse } from "next/server"
import { pusher } from "@/lib/pusher"
import { kv } from "@vercel/kv"

export async function POST(req: NextRequest) {
  const json = await req.json();

  const { messages, id } = json;

  // Last message sent by the user
  const lastUserMessage = messages.reverse().find((msg: any) => msg.role === 'user');

  if (lastUserMessage) {
    // Check user balance (replace this with actual SQL code)
    const userBalance = await checkUserBalance(id); // Placeholder function

    if (userBalance >= 7) {
      // Create a job and add it to the Vercel KV queue
      const job = JSON.stringify({ userId: id, message: lastUserMessage.content, model: 'Vicuna' });
      await kv.rpush('job_queue', job);

      // Trigger a "new job" event via Pusher to alert model providers
      pusher.trigger('my-channel', 'new-job', {});

      // Deduct balance (replace this with actual SQL code)
      await deductUserBalance(id, 7); // Placeholder function
    } else {
      return NextResponse.json({ error: 'Insufficient balance' });
    }
  }

  return NextResponse.json("Job queued");
}

// Placeholder functions
async function checkUserBalance(userId: number) {
  // Check user balance from SQL database
  return 10; // Example balance
}

async function deductUserBalance(userId: number, amount: number) {
  // Deduct user balance in SQL database
}
