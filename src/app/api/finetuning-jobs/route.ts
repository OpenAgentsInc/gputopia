import OpenAI from 'openai'

import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  if (!session) {
    return new NextResponse('Unauthorized', {
      status: 401
    })
  }
  const openai = new OpenAI({
    apiKey: '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'
  })

  try {
    const list = await openai.fineTuning.jobs.list()
    const jobs = []

    for await (const fineTune of list) {
      jobs.push(fineTune)
    }

    return NextResponse.json({
      jobs
    })
  } catch (error) {
    console.log(error)
  }
}
