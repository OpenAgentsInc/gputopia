import { generate, generateAndStream } from "./webllm"

export interface Job {
  userId: number
  message: string
  model: string
}

export const processJob = async (job: Job) => {

  // For now assume Vicuna
  // If not ready, return
  // If this user was the sender, return (or nah?)

  // console.log("got a jerrrrbb", job)

  // console.log("Processing")
  // console.log("channel?", window.jobChannel)
  const response = await generateAndStream(job, window.jobChannel)
  // console.log(response)
  return response
}
