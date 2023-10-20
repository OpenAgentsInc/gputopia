'use client'

import Link from 'next/link'
import { CreateJob } from './components/create-job'
import { useFinetuneJobs } from '@/lib/hooks/use-finetune-jobs'

export default function Finetune() {
  const jobs = useFinetuneJobs()
  return (
    <div className="mt-12 bg-transparent min-h-screen p-8">
      <h1 className="text-2xl font-bold my-4">Fine-tuning</h1>

      <div className="flex flex-row justify-between mb-8">
        <div className="flex flex-row">
          <button className="px-4 py-2 border rounded mr-2">All</button>
          <button className="px-4 py-2 border rounded mr-2">Successful</button>
          <button className="px-4 py-2 border rounded">Failed</button>
        </div>
        <CreateJob />
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          {jobs.map(job => {
            const humanReadableDate = new Date(job.created_at * 1000).toLocaleString()
            return (
              <Link key={job.id} href={`/finetune/${job.id}`}>
                <div className="flex flex-row justify-between items-center border p-4">
                  <span className="font-mono text-sm font-semibold">{job.fine_tuned_model ?? job.model}</span>
                  <div className="text-xs">{humanReadableDate}</div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="w-full h-full flex justify-center items-center opacity-50 italic min-h-[300px]">
          Select a job to view details.
        </div>
      </div>
    </div>
  )
}
