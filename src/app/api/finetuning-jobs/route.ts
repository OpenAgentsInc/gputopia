import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { writeFile } from 'fs/promises'
import { createReadStream } from 'fs'

export async function GET() {
  const session = await auth()
  if (!session) {
    return new NextResponse('Unauthorized', {
      status: 401
    })
  }
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  try {
    const list = await openai.fineTuning.jobs.list()
    const jobs = []

    for await (const fineTune of list) {
      jobs.push(fineTune)
    }

    return NextResponse.json({ jobs })
  } catch (error) {
    console.log(error)
  }
}

export async function POST(request: NextRequest) {
  const data = await request.formData()
  const trainingFile: File | null = data.get('trainingData') as unknown as File
  const validationFile: File | null = data.get('validationData') as unknown as File

  if (!trainingFile || !validationFile) {
    return NextResponse.json({ success: false })
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const trainingBytes = await trainingFile.arrayBuffer()
  const trainingBuffer = Buffer.from(trainingBytes)
  const trainingPath = `/tmp/${trainingFile.name}`
  await writeFile(trainingPath, trainingBuffer)

  const trainingOpenaiFile = await openai.files.create({
    file: createReadStream(trainingPath),
    purpose: 'fine-tune'
  })

  const validationBytes = await validationFile.arrayBuffer()
  const validationBuffer = Buffer.from(validationBytes)
  const validationPath = `/tmp/${validationFile.name}`
  await writeFile(validationPath, validationBuffer)

  const validationOpenaiFile = await openai.files.create({
    file: createReadStream(trainingPath),
    purpose: 'fine-tune'
  })

  const { id: trainingId } = trainingOpenaiFile
  const { id: validationId } = validationOpenaiFile

  const fineTune = await openai.fineTuning.jobs.create({
    training_file: trainingId,
    validation_file: validationId,
    model: 'davinci-002',
    hyperparameters: { n_epochs: 3 }
  })
  console.log(fineTune)

  return NextResponse.json({ success: true, finetuneId: fineTune.id })
}
