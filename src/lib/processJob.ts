import { Channel } from "pusher-js"
import { complete } from "./complete"
import { useStore } from "./store"
import { generateAndStream } from "./webllm"

export interface Job {
  userId: number
  jobId: string
  message: string
  model: string
}


// For now assume Vicuna
export const processJob = async (job: Job) => {
  const modelLoaded = useStore.getState().modelLoaded
  if (!modelLoaded) {
    console.log("Received job but model not loaded, returning")
    return
  }

  // If not ready, return
  const busyInferencing = useStore.getState().busyInferencing

  if (busyInferencing) {
    console.log("Tried to start inferencing while busy, returning")
    return
  }

  // If this user was the sender, return
  const myUserId = window.sessionStorage.getItem("userId")
  const userId = Number(myUserId)

  if (userId === 0 || !userId) {
    alert("No user ID found, please log in")
    return
  }

  if (userId === job.userId) {
    console.log("Received job from self, skipping")
    return
  }

  fetch("/api/lock-job", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobId: job.jobId, updated: true }),
  }).then((res) => {
    if (res.ok) {
      return res.json()
    }
  }).then(async (json) => {
    // console.log(`Locking job ${job.jobId} with key ${lockKey}`)
    if (json.lockSet === 1) {
      const response = await generateAndStream(job, window.jobChannel)
      if (response === "error" || !response) {
        console.log("Error generating inference")
        return
      }
      complete(response, job.jobId)
    } else {
      console.log("Job already locked, skipping")
    }
  }).catch((error) => {
    console.log(error);
  })
}
