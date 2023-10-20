import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return new NextResponse('Unauthorized', {
      status: 401
    })
  }
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  try {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ events: [] })
    }
    const list = await openai.fineTuning.jobs.listEvents(id, { limit: 100 })

    return NextResponse.json({ events: list.data })
  } catch (error) {
    console.log(error)
  }
}
