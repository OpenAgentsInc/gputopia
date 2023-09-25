import { NextRequest, NextResponse } from "next/server"
import { kv } from "@vercel/kv"

export async function POST(req: NextRequest) {
  const json = await req.json();
  const { jobId } = json;

  const lockKey = `lock:${jobId}`;
  console.log("Attempting to lock job:", jobId)

  // Try to acquire lock
  const lockSet = await kv.setnx(lockKey, 'locked');

  return NextResponse.json({ lockSet });
}
