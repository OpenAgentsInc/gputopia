import { Channel } from "pusher-js"
import { complete } from "./complete"
import { generateAndStream } from "./webllm"

export interface Job {
  userId: number
  jobId: string
  message: string
  model: string
}


// For now assume Vicuna
export const processJob = async (job: Job) => {

  // If not ready, return


  // If this user was the sender, return
  const myUserId = window.sessionStorage.getItem("userId")
  const userId = Number(myUserId)

  if (userId === 0 || !userId) {
    alert("No user ID found, please log in")
    return
  }

  console.log(userId, job.userId)
  if (userId === job.userId) {
    console.log("Received job from self, skipping")
    return
  }



  // console.log("Received job")
  // console.log("got a jerrrrbb", job)

  // console.log("Processing")
  // console.log("channel?", window.jobChannel)

  const lockKey = `lock:${job.jobId}`;

  fetch("/api/lock-job", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobId: job.jobId }),
  }).then((res) => {
    if (res.ok) {
      return res.json()
    }
  }).then(async (json) => {
    console.log(`Locking job ${job.jobId} with key ${lockKey}`)
    if (json.lockSet === 1) {
      const response = await generateAndStream(job, window.jobChannel)
      if (response === "error" || !response) {
        console.log("Error generating inference")
        return
      }
      console.log(response)
      complete(response, job.jobId)
    } else {
      console.log("Job already locked, skipping")
    }
  }).catch((error) => {
    console.log(error);
  })


  // Try to acquire lock
  // const lockSet = await kv.setnx(lockKey, 'locked');

  // // const lockSet = await kv.setnx(`lock:${job.jobId}`, 'locked', 'EX', 10);

  // if (lockSet === 1) { // Lock acquired
  //   console.log("Won job, completing...")
  //   const response = await generateAndStream(job, window.jobChannel)
  // } else {
  //   console.log("Job already locked, skipping")
  // }

  //   const job = JSON.parse(await kv.lpop("job_queue"));
  //   if (job) {
  //     // Remove temporary lock
  //     await kv.del(`lock:${job.jobId}`);

  //     // Perform inference and send result back to server
  //   } else {
  //     // Remove temporary lock
  //     await kv.del(`lock:${job.jobId}`);
  //   }
  // }




  // console.log(response)
  // return response
}
