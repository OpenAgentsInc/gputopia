interface FinetuneJob {
  id: string
  name: string
  createdAt: string
}

export function useFinetuneJobs(): FinetuneJob[] {
  return [
    {
      id: '1',
      name: 'my-custom-mistral',
      createdAt: '10/16/2023, 3:57 PM'
    },
    {
      id: '2',
      name: 'my-custom-llama2',
      createdAt: '10/15/2023, 1:57 PM'
    }
  ]
}
