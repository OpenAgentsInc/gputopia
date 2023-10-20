import { writeFile } from 'fs/promises'
import OpenAI from 'openai'

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
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

    return NextResponse.json({
      jobs
    })
  } catch (error) {
    console.log(error)
  }
}

export async function POST(request: NextRequest) {
  const data = await request.formData()
  const file: File | null = data.get('trainingData') as unknown as File
  const file2: File | null = data.get('validationData') as unknown as File

  if (!file || !file2) {
    return NextResponse.json({ success: false })
  }

  // const filebytes = await file.arrayBuffer()
  // const buffer = Buffer.from(filebytes)

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const trainingId = 'file-mLhi4tBymx1FrB2JXOQ1i0g2'
  const validationId = 'file-UQqPmIBgUQH9HptOz7tz8aV3'

  const fineTune = await openai.fineTuning.jobs.create({
    training_file: trainingId,
    validation_file: validationId,
    model: 'davinci-002',
    hyperparameters: { n_epochs: 2 }
  })
  console.log(fineTune)

  // With the file data in the buffer, you can do whatever you want with it.
  // For this, we'll just write it to the filesystem in a new location
  // const path = `/tmp/${file.name}`
  // await writeFile(path, buffer)

  // const openaifile = await openai.files.create({
  //   file: createReadStream(path),
  //   purpose: 'fine-tune'
  // })

  // const { object, id: trainingId, purpose, filename, bytes, created_at, status, status_details } = openaifile

  // console.log('Training file ID: ', trainingId)

  // console.log(`open ${path} to see the uploaded file`)

  return NextResponse.json({ success: true, finetuneId: fineTune.id })
}

// export const config = {
//   api: {
//     bodyParser: false
//   }
// }

// const promisifyPipeline = stream.promises.pipeline

// export async function POST(req) {
//   const session = await auth()
//   if (!session) {
//     return new NextResponse('Unauthorized', {
//       status: 401
//     })
//   }

//   console.log('LETS UPLOAD UR FILE')

//   const openai = new OpenAI({
//     apiKey: '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'
//   })

//   const fileWriteStream = fs.createWriteStream('mydata.jsonl')
//   await promisifyPipeline(req, fileWriteStream)

//   const file = await openai.files.create({
//     file: fs.createReadStream('mydata.jsonl'),
//     purpose: 'fine-tune'
//   })
//   console.log('worked?', file)

//   return NextResponse.json({
//     status: 'what'
//   })
// }
