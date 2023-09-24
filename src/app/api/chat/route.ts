// import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from "ai"
import { NextRequest, NextResponse } from "next/server"
// import { Configuration, OpenAIApi } from 'openai-edge'
// import { auth } from '@/auth'
import { nanoid } from "@/lib/utils"

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const json = await req.json()
  const { messages, previewToken } = json
  const userId = 1
  // const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }


  // const res = await openai.createChatCompletion({
  //   model: 'gpt-3.5-turbo',
  //   messages,
  //   temperature: 0.7,
  //   stream: true
  // })

  // const stream = OpenAIStream(res, {
  //   async onCompletion(completion) {
  //     const title = json.messages[0].content.substring(0, 100)
  //     const id = json.id ?? nanoid()
  //     const createdAt = Date.now()
  //     const path = `/chat/${id}`
  //     const payload = {
  //       id,
  //       title,
  //       userId,
  //       createdAt,
  //       path,
  //       messages: [
  //         ...messages,
  //         {
  //           content: completion,
  //           role: 'assistant'
  //         }
  //       ]
  //     }
  //     await kv.hmset(`chat:${id}`, payload)
  //     await kv.zadd(`user:chat:${userId}`, {
  //       score: createdAt,
  //       member: `chat:${id}`
  //     })
  //   }
  // })

  // return new StreamingTextResponse(stream)
  return NextResponse.json("Works")
  // return NextResponse.json({
  //   // messages: [
  //   //   ...messages,
  //   //   {
  //   //     content: 'Hello',
  //   //     role: 'assistant'
  //   //   }
  //   // ]
  // })
}
