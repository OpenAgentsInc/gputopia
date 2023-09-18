'use client'

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

let chat: webllm.ChatModule;

export async function initModel() {
  chat = new webllm.ChatModule();
  chat.setInitProgressCallback((report: webllm.InitProgressReport) => {
    try {
      const perc = (report.progress * 100).toFixed(0)
      useStore.setState({ modelLoadPercentage: Number(perc) })
      setLabel("perc", perc + "%");
    } catch (e) { }
  });
  await chat.reload("vicuna-v1-7b-q4f32_0");
  const event = new Event('model-loaded');
  document.dispatchEvent(event);
}

export async function generate(prompt: string) {
  if (!chat) {
    return
  }
  let reply
  try {
    reply = await chat.generate(prompt, () => { });
  } catch (e) {
    return
  }

  // Fetch POST to complete the inference
  complete(reply)

  return reply;
}
