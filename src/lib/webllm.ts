'use client'

import AiWorker from "./AiWorker"
import * as webllm from "@mlc-ai/web-llm"
import { complete } from "./complete"
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
      spiderURL: "wss://ai-spider-production.up.railway.app/worker",
      lnURL: lnURL,
      userId: userId,
    })
  }
  worker.on("loading", (report: webllm.InitProgressReport) => {
    try {
      const perc = (report.progress * 100).toFixed(0)
      useStore.setState({ modelLoadPercentage: Number(perc) })
      setLabel("perc", perc + "%");
    } catch (e) { }
  });
  await worker.preload("vicuna-v1-7b-q4f32_0");
  const event = new Event('model-loaded');
  document.dispatchEvent(event);
}

export async function generate(prompt: string) {
  if (!worker) {
    return
  }
  let reply
  try {
    reply = await worker.generate(prompt, () => { });
  } catch (e) {
    return
  }

  // Fetch POST to complete the inference
  complete(reply)

  return reply;
}
