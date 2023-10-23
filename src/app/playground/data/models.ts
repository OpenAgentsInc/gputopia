export const types = ['Mistral'] as const

export type ModelType = (typeof types)[number]

export interface Model<Type = string> {
  id: string
  name: string
  description: string
  strengths?: string
  type: Type
}

export const models: Model<ModelType>[] = [
  {
    id: 'c305f976-8e38-42b1-9fb7-d21b2e34f0da',
    name: 'mistral-7b',
    description: 'Super awesome model, blah blah blah.',
    type: 'Mistral',
    strengths: 'Open model not from OpenAI lol pwned'
  }
]
