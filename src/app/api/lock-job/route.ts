import mysql from "mysql2/promise"
import { NextRequest, NextResponse } from "next/server"
import { pusher } from "@/lib/pusher"
import { kv } from "@vercel/kv"

export async function POST(req: NextRequest) {
  const json = await req.json();
  const { jobId } = json;

  const lockKey = `lock:${jobId}`;
  console.log("Attempting to lock job:", jobId)

  // Try to acquire lock
  // const lockSet = await kv.setnx(lockKey, 'locked');

}
