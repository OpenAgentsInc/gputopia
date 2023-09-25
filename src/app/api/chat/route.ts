import { OpenAIStream, StreamingTextResponse } from "ai"
import { NextRequest, NextResponse } from "next/server"
// import { auth } from '@/auth'
import { kv } from "@vercel/kv"

export async function POST(req: NextRequest) {
  const json = await req.json()

  /**
   * json example:
  {
    messages: [
      { role: 'user', content: 'wehwwwww' },
      { role: 'assistant', content: '"Hi"' },
      { role: 'user', content: 'asfasdfasdf' }
    ],
    id: 'IAu2cpr',
    previewToken: null
  }
   */

  const { messages, id, previewToken } = json



  return NextResponse.json("Hi")
}
