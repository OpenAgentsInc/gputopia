import axios from 'axios'
import { useEffect, useState } from 'react'

export function useFinetuneJobEvents(id: string | undefined) {
  const [events, setEvents] = useState([])

  useEffect(() => {
    if (!id) return
    console.log(`Retrieving events for job ${id}`)
    const fetchData = async () => {
      const response = await axios.get(`/api/finetuning-job-events/${id}`)
      setEvents(response.data.events)
    }

    fetchData()
  }, [id])

  return events
}
