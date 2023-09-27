import { NextRequest, NextResponse } from "next/server"
import { kv } from "@vercel/kv"

export async function POST(req: NextRequest) {
  const json = await req.json();
  const { jobId, updated } = json;

  // Get the user ID
  const userIdString = req.cookies.get('userId');
  if (!userIdString) {
    throw new Error("Missing user ID cookie");
  }
  const userId = Number(userIdString.value);

  if (!updated) {
    console.log(`Forcing update for user ${userId} on job ${jobId}`)
    throw new Error("Outdated client code, please refresh")
  }

  const lockKey = `lock:${jobId}`;
  console.log(`Attempting to lock job ${jobId}`)

  // Try to acquire lock
  const lockSet = await kv.setnx(lockKey, 'locked');

  try {
    if (lockSet === 1) { // Lock acquired
      console.log(`"WON JOB: user ${userId} locked job ${jobId}`)
    } else {
      console.log(`"LOST JOB: user ${userId} lost out on job ${jobId}`)
    }

  } catch (e) {
    console.log("Error locking job")
  }



  return NextResponse.json({ lockSet });
}
