import { auth } from '@/auth'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { nanoid } from 'nanoid'
import { NextRequest, NextResponse } from 'next/server'
import { Configuration, OpenAIApi } from 'openai-edge'
import { kv } from '@vercel/kv'

export const runtime = 'edge'

const token = 'ac4a9ce1c028c7a1e652d11f4d7e009e'
// process.env.CRON_AI_TOKEN

const configuration = new Configuration({
  apiKey: token,
  basePath: 'https://queenbee.gputopia.ai/v1'
})

const openai = new OpenAIApi(configuration)

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return new NextResponse('Unauthorized', {
      status: 401
    })
  }

  const json = await req.json()
  const { messages } = json

  const res = await openai.createChatCompletion({
    model: 'vicuna-7B-q4',
    messages,
    max_tokens: 500,
    stream: true
  })

  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      const session = await auth()
      const userId = session?.user.user_id
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
  })

  return new StreamingTextResponse(stream)
}
