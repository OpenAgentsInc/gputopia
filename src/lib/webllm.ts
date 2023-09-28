// 'use client'

import AiWorker from "./AiWorker"
import { Channel } from "pusher-js"
import * as webllm from "@mlc-ai/web-llm"
import appConfig from "./app-config"
import { complete } from "./complete"
import { Job } from "./processJob"
import { useStore } from "./store"

// We use label to intentionally keep it simple
function setLabel(id: string, text: string) {
  const label = document.getElementById(id);
  if (label == null) {
    throw Error("Cannot find label " + id);
  }
  label.innerText = text;
}

let worker: AiWorker | null = null;

export async function initModel(lnURL: string, userId: string) {
  if (!worker) {
    worker = new AiWorker({
      spiderURL: process.env.NEXT_PUBLIC_AI_SPIDER_URL as string,
      lnURL: lnURL,
      userId: userId,
    })
    worker.on("loading", (report: webllm.InitProgressReport) => {
      try {
        const perc = (report.progress * 100).toFixed(0)
        useStore.setState({ modelLoadPercentage: Number(perc) })
        setLabel("perc", perc + "%");
      } catch (e) { }
    });
    await worker.preload(process.env.NEXT_PUBLIC_AI_PRELOAD_MODEL || "vicuna-v1-7b-q4f32_0");
    const event = new Event('model-loaded');
    document.dispatchEvent(event);
  }
}

export async function unloadModel() {
  await worker.unload()
  worker = null
  console.log("Unloaded")
}

export async function generate(prompt: string) {
  const busyInferencing = useStore.getState().busyInferencing

  if (busyInferencing) {
    console.log("Tried to start inferencing while busy, returning")
    return
  }

  if (!worker) {
    return
  }
  
  console.log("old gen hit, ignored")
  return
  
  let reply

  const generateProgressCallback = (_step: number, message: string) => {
    console.log(message)
  };

  try {
    // @ts-ignore
    useStore.setState({ busyInferencing: true })
    reply = await worker.generate(prompt);
    console.log(reply)
  } catch (e) {
    useStore.setState({ busyInferencing: false })
    return
  }

  // Fetch POST to complete the inference
  complete(reply || "")
  
  useStore.setState({ busyInferencing: false })


  return reply;
}

let lastSentTime = 0;
let queuedMessage: string | null = null;

export async function generateAndStream(job: Job, channel: Channel) {
  if (!channel || !worker) {
    // console.log('Returning because no channel or worker')
    return;
  }

  const generateProgressCallback = (_step: number, message: string) => {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastSentTime;

    if (timeDiff >= 250) {
      try {
        channel.trigger(`client-job-${job.userId}`, { message });
        lastSentTime = currentTime;
      } catch (e) {
        console.error(e);
      }
    } else {
      queuedMessage = message;
    }
  };

  try {
    const reply = await worker.generate(job.message, generateProgressCallback);

    // Send any remaining queued message
    if (queuedMessage) {
      channel.trigger(`client-job-${job.userId}`, { message: queuedMessage });
      queuedMessage = null;
    }
    return reply;
  } catch (e) {
    return;
  }
}
