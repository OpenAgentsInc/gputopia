import axios from 'axios'
import { useEffect, useState } from 'react'

interface FinetuneJob {
  id: string
  object: string
  created_at: number
  level: string
  message: string
  data: any
  type: string
  fine_tuned_model: string
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
