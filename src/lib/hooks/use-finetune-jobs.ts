import axios from 'axios'
import { useEffect, useState } from 'react'

interface FinetuneJob {
  created_at: number
  error: any
  fine_tuned_model: string
  finished_at: number
  hyperparameters: {
    n_epochs: number
  }
  id: string
  model: string
  object: string
  organization_id: string
  result_files: string[]
  status: string
  trained_tokens: number
  training_file: string
  validation_file: string
}

export function useFinetuneJobs(): FinetuneJob[] {
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('/api/finetuning-jobs')
      setJobs(response.data.jobs)
    }

    fetchData()
  }, [])

  return jobs
}
