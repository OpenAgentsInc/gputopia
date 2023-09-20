import * as webllm from "@mlc-ai/web-llm";

type InitMessage = {
  [key: string]: any;
};


// AiWorker.ts
export type AiConfig = {
  spiderURL: string;
  lnURL: string;
  userId: string;
  [key: string]: any;
};

type Callbacks = {
  jobStart?: () => void;
  loading?: (report: any) => void;
  progress?: (report: any) => void;
  jobDone?: (status: {error: string | null, secs: number}) => void;
  connect?: () => void;
  disconnect?: () => void;
  [key: string]: any;
};

class AiWorker {
  private websocket: WebSocket | null = null;
  public config: AiConfig;
  private callbacks: Callbacks = {};
  chat: webllm.ChatModule;
  model: any;
  busy: boolean;
  stream: boolean;
  streamStart: number;

  constructor(config: AiConfig) {
    this.config = config;
    this.busy = false;
    this.stream = false;
    this.streamStart = 0;
    this.chat = new webllm.ChatModule();
    this.chat.setInitProgressCallback((report: any)=>{
      this.callbacks.loading?.(report);
      console.log("loading", report)
    })
    this.connect();
  }

  async preload(model: string) {
    this.busy = true;
    await this.chat.reload(model)
    this.model = model;
    this.busy = false;
  }
  
  public on(event: string, callback: any) {
    this.callbacks[event] = callback;
  }

  public disconnect() {
    if (this.websocket) {
      this.websocket.close();
    }
  }

  public async reconnect() {
    this.disconnect();
    this.connect();
  }

  public async handleOpenAiReq(req: any): Promise<void> {
    console.log("GOT SPIDER REQ!!!", req)
    if (this.busy)
      return;

    this.busy = true

    try {
      // load model
      const reply = await this.getOpenAiReply(req);
      console.log(reply)
      if (this.stream) {
        this.websocket?.send(JSON.stringify({ model: this.model, choices: [{message: { role: "assistant", content: this.streamContent(reply)}, index: 0 }] } ))
        this.websocket?.send(JSON.stringify({ model: this.model, choices: [{message: { role: "assistant", content: ""}, finish_reason: "stop", index: 0 }] } ))
      } else {
        this.websocket?.send(JSON.stringify({ model: this.model, choices: [{message: { role: "assistant", content: reply}, finish_reason: "stop", index: 0}] }))
      }
      
    }
    catch (e) {
      console.log("error:", e)
    }
    this.busy = false
  }

  private streamContent(content: string) {
    const ret = content.slice(this.streamStart)
    this.streamStart =  content.length
    return ret;
  }

  private async getOpenAiReply(req: any) {
    let model = req.model

    if (model.startsWith("webgpu/")) {
      model = model.slice(7);
    }

    if (model != this.model) {
      console.log("RELOADING MODEL", model)
      await this.chat.reload(model);
      this.model = model;
    }

    console.log("RESET CHAT", model)
    // clear
    await this.chat.resetChat();

    // @ts-ignore
    /*    const conversation = this.chat.getPipeline().conversation;
    
        // load whole conversation
        conversation.getPromptArrayLastRound = conversation.getPromptArray;
        for (let i = 0; i < req.messages.length - 1; i++) {
          const message = req.messages[i];
          if (message.role === "system") {
            conversation.system = message.content;
          }
          let inp: string; // Assuming 'inp' is defined somewhere as a string
          if (message.role === "user") {
            conversation.appendMessage(conversation.config.roles[0], message.content);
          } else {
            conversation.appendMessage(conversation.config.roles[1], message.content);
          }
        }
    */
    console.log("HERE REQ!!!", req)
    this.stream = req.stream
    this.streamStart = 0
    const reply = await this.chat.generate(req.messages[req.messages.length - 1], this.progress.bind(this));
    console.log("HERE REPLY!!!", reply)
    return reply;
  }

  public async generate(prompt: string) {
    if (this.busy) {
      console.log("got gen while busy, ignoring")
      return null;
    }
    this.busy = true;
    try {
      const res = await this.getOpenAiReply({
        model: "vicuna-v1-7b-q4f32_0",
        messages: { "role": "user", "content": prompt }
      })    
    this.busy = false;
      return res;
    } catch (e) {
      console.log("error while gen:", e)
    }
    this.busy = false;
    return null;
  }

  private progress(report: any, content: string ) {
    if (this.stream) {
      this.websocket?.send(JSON.stringify({ choices: [{ "message": { "role": "assistant", "content": this.streamContent(content) } }] }))
    }
    this.callbacks.progress?.(report);
  }

  public async getAvailableStorageSpace() : Promise<number | null> {
    return new Promise((resolve) => {
      if (navigator.storage && navigator.storage.estimate) {
        navigator.storage.estimate().then(({ usage, quota }) => {
          resolve(quota && usage ? quota - usage : null);
        });
      } else {
        resolve(null);
      }
    });
  }

  public getWebGLRendererInfo(): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
      if (gl) {
        const extension = gl.getExtension('WEBGL_debug_renderer_info');
        if (extension) {
          const renderer = gl.getParameter(extension.UNMASKED_RENDERER_WEBGL);
          resolve(renderer);
        } else {
          resolve("");
        }
      } else {
        resolve("");
      }
    });
  }
  
  // Usage example
  public async initMessage() :  Promise<InitMessage> {
      return {
          "ln_url": this.config.lnURL,
          "auth_key": "uid:" + String(this.config.userId),
          "cpu_count": navigator.hardwareConcurrency || 1,
          "disk_space": await this.getAvailableStorageSpace(),
          // @ts-ignore
          "vram": (navigator.deviceMemory || 1) * 1000000000,
          "web_gpus": [
              {
                  "name": await this.getWebGLRendererInfo(),
              }
          ]
      }
  }

  private connect() {
    console.log("try connect")
    this.websocket = new WebSocket(this.config.spiderURL);
    this.websocket.addEventListener("open", async () => {
      this.websocket?.send(JSON.stringify(await this.initMessage()));
      this.callbacks.connect?.();
      console.log("connected to spider")
    });

    this.websocket.addEventListener("message", async (event: any) => {
      const data = JSON.parse(event.data);
      if (data.openai_req) {
        const start = performance.now()
        let err: string | null = null
        this.callbacks.jobStart?.();
        try {
          await this.handleOpenAiReq(data.openai_req)
        } catch {
          err = "ai generator failed"
        }
        this.callbacks.jobDone?.({error: err, secs: performance.now()-start});
      }
    });

    this.websocket.addEventListener("close", () => {
      this.callbacks.disconnect?.();
      this.connect();
    });
  }
}

// Export for use in other modules
export default AiWorker;
