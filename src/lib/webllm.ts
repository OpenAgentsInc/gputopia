// 'use client'

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

let chat: webllm.ChatModule;

export async function initModel(model = "vicuna-v1-7b-q4f32_0") {
  console.log("Loading model: " + model)
  chat = new webllm.ChatModule();
  chat.setInitProgressCallback((report: webllm.InitProgressReport) => {
    try {
      const perc = (report.progress * 100).toFixed(0)
      useStore.setState({ modelLoadPercentage: Number(perc) })
      setLabel("perc", perc + "%");
    } catch (e) { }
  });
  await chat.reload(model, {}, appConfig);

  useStore.setState({ modelLoaded: true })

  const event = new Event('model-loaded');
  document.dispatchEvent(event);
}

export async function unloadModel() {
  await chat.unload()
  console.log("Unloaded")
}

export async function generate(prompt: string) {
  const busyInferencing = useStore.getState().busyInferencing

  if (busyInferencing) {
    console.log("Tried to start inferencing while busy, returning")
    return
  }

  if (!chat) {
    return
  }
  let reply

  const generateProgressCallback = (_step: number, message: string) => {
    console.log(message)
  };

  try {
    useStore.setState({ busyInferencing: true })
    reply = await chat.generate(prompt, generateProgressCallback);
    console.log(reply)
  } catch (e) {
    useStore.setState({ busyInferencing: false })
    return
  }

  useStore.setState({ busyInferencing: false })

  return reply;
}

let lastSentTime = 0;
let queuedMessage: string | null = null;

export async function generateAndStream(job: Job, channel: Channel) {
  if (!channel || !chat) {
    // console.log('Returning because no channel or chat')
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
    const reply = await chat.generate(job.message, generateProgressCallback);

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
