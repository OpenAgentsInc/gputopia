export interface ChatModel {
  name: string
  displayName: string
  description: string
  page: string
  website: string
}

export var defaultModel: ChatModel = {
  name: 'vicuna-7B-q4',
  displayName: 'Vicuna 7b',
  description:
    'Vicuna is a chat assistant trained by fine-tuning Llama 2 on user-shared conversations collected from ShareGPT.',
  page: 'https://huggingface.co/TheBloke/vicuna-7B-v1.5-GGUF',
  website: 'https://lmsys.org/blog/2023-03-30-vicuna/'
}

export var llama2_7b: ChatModel = {
  name: 'TheBloke/Llama-2-7B-Chat-GGUF:Q4_K_M',
  displayName: 'LLama2 7b',
  description: 'Llama 2 was pretrained on publicly available online data sources.',
  page: 'https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF',
  website: 'https://ai.meta.com/llama/'
}

export var llama2_13b: ChatModel = {
  name: 'TheBloke/Llama-2-13B-Chat-GGUF:Q4_K_M',
  displayName: 'LLama2 13b',
  description: 'Llama 2 was pretrained on publicly available online data sources.',
  page: 'https://huggingface.co/TheBloke/Llama-2-13B-chat-GGUF',
  website: 'https://ai.meta.com/llama/'
}

export var claude2: ChatModel = {
  name: 'TheBloke/claude2-alpaca-13B-GGUF:Q4_K_M',
  displayName: 'Claude2 13b',
  description:
    'Think of Claude as a friendly, enthusiastic colleague or personal assistant who can be instructed in natural language to help you with many tasks.',
  page: 'https://huggingface.co/TheBloke/claude2-alpaca-13B-GGUF/tree/main',
  website: 'https://www.anthropic.com/index/claude-2'
}

export var availableModels: ChatModel[] = [defaultModel, llama2_7b, llama2_13b, claude2]
