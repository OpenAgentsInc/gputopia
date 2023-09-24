'use client'

import * as webllm from "@mlc-ai/web-llm"
import appConfig from "./app-config"
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
  const event = new Event('model-loaded');
  document.dispatchEvent(event);
}

export async function unloadModel() {
  await chat.unload()
  console.log("Unloaded")
}

export async function generate(prompt: string) {
  if (!chat) {
    return
  }
  let reply

  const generateProgressCallback = (_step: number, message: string) => {
    console.log(message)
  };

  try {
    reply = await chat.generate(prompt, generateProgressCallback);
    console.log(reply)
  } catch (e) {
    return
  }

  // Fetch POST to complete the inference
  // complete(reply)

  return reply;
}
