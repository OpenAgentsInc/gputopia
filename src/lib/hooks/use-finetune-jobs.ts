interface FinetuneJob {
  id: string
  object: string
  created_at: number
  level: string
  message: string
  data: any
  type: string
}

export function useFinetuneJobs(): FinetuneJob[] {
  return [
    {
      id: 'ft-event-TjX0lMfOniCZX64t9PUQT5hn',
      object: 'fine_tuning.job.event',
      created_at: 1689813489,
      level: 'warn',
      message: 'Fine tuning process stopping due to job cancellation',
      data: null,
      type: 'message'
    },
    {
      id: 'ft-event-TjijfnfOniCZX64t9PUQT5hn',
      object: 'fine_tuning.job.event',
      created_at: 1689803489,
      level: 'warn',
      message: 'Fine tuning process stopping due to job cancellation',
      data: null,
      type: 'message'
    }
  ]
}
