import axios from 'axios'
import { useEffect, useState } from 'react'

export interface FinetuneJobEvent {
  created_at: number
  data: {
    step: number
    train_loss: number
    train_mean_token_accuracy: number
    valid_loss: number
    valid_mean_token_accuracy: number
  }
  id: string
  level: string
  message: string
  object: string
  type: string
}

export function useFinetuneJobEvents(id: string | undefined): FinetuneJobEvent[] {
  const [events, setEvents] = useState([])

  useEffect(() => {
    if (!id) return
    const fetchData = async () => {
      const response = await axios.get(`/api/finetuning-job-events?id=${id}`)
      setEvents(response.data.events)
    }

    fetchData()
  }, [id])

  return events
}
