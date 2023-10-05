import { OpenAIStream, StreamingTextResponse } from "ai"
import { NextRequest } from "next/server"
import { Configuration, OpenAIApi } from "openai-edge"

export const runtime = 'edge'

const token = process.env.BYPASS_TOKEN

const configuration = new Configuration({
  apiKey: token,
  basePath: "https://queenbee.gputopia.ai/v1"
})

const openai = new OpenAIApi(configuration)

export async function POST(req: NextRequest) {
  const json = await req.json();
  const { messages } = json;

  const res = await openai.createChatCompletion({
    model: "vicuna-7B-q4",
    messages,
    max_tokens: 100,
    stream: true
  })

  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      console.log("Successful_completion:", completion)
    }
  })

  return new StreamingTextResponse(stream)
}
