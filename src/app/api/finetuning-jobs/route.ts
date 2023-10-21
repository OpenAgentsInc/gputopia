import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { writeFile } from 'fs/promises'
import { createReadStream } from 'fs'
import axios from 'axios'

export async function GET() {
  const session = await auth()
  if (!session) {
    return new NextResponse('Unauthorized', {
      status: 401
    })
  }

  const openai = new OpenAI({
    apiKey: 'ac4a9ce1c028c7a1e652d11f4d7e009e',
    baseURL: 'https://queenbee.gputopia.ai/v1'
  })

  // make request to queenbee with apitoken as Authorization bearer header
  const res = await axios.get('https://queenbee.gputopia.ai/v1/fine_tuning/jobs', {
    headers: {
      Authorization: `Bearer ac4a9ce1c028c7a1e652d11f4d7e009e`
    }
  })
  // console.log(res)
  const json = await res.data
  // console.log(json)

  // let jobs = []
  // try {
  //   const list = await openai.fineTuning.jobs.list()
  //   console.log('list is', list)

  //   for await (const fineTune of list) {
  //     jobs.push(fineTune)
  //     console.log('PUSHED', fineTune.id)
  //   }
  // } catch (error) {
  //   console.log(error)
  //   return
  // }

  return NextResponse.json({ jobs: json.data.reverse() })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return new NextResponse('Unauthorized', {
      status: 401
    })
  }
  const data = await request.formData()
  const trainingFile: File | null = data.get('trainingData') as unknown as File
  const validationFile: File | null = data.get('validationData') as unknown as File

  if (!trainingFile || !validationFile) {
    return NextResponse.json({ success: false })
  }

  const openai = new OpenAI({
    apiKey: 'ac4a9ce1c028c7a1e652d11f4d7e009e',
    baseURL: 'https://queenbee.gputopia.ai/v1'
  })

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
    model: 'mistralai/Mistral-7B-Instruct-v0.1',
    hyperparameters: { n_epochs: 3 }
  })
  console.log(fineTune)

  return NextResponse.json({ success: true, finetuneId: fineTune.id })
}
