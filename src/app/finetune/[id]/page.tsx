'use client'

import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { CreateJob } from '../components/create-job'
import { useFinetuneJobs } from '@/lib/hooks/use-finetune-jobs'
import { useFinetuneJobEvents } from '@/lib/hooks/use-finetune-job-events'

export default function FinetuneDetail({ params }: { params: { id: string } }) {
  const jobs = useFinetuneJobs()
  const job = jobs.find(job => job.id === params.id)
  const jobEvents = useFinetuneJobEvents(job?.id)
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

        {job && (
          <div>
            <h3 className="text-xs font-semibold">MODEL</h3>
            <h3 className="text-lg font-semibold mb-8">{job?.fine_tuned_model ?? job?.model}</h3>
            <p className="mb-2">
              <strong>Job ID</strong>: {job?.id}
            </p>
            <p className="mb-2">
              <strong>Base model</strong>: {job?.model}
            </p>
            <p className="mb-2">
              <strong>Created at</strong>:{' '}
              {new Date(job.created_at * 1000).toLocaleString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}
            </p>
            <Separator />
            <p className="mb-2">
              <strong>Trained tokens</strong>: {job?.trained_tokens ?? '-'}
            </p>
            <p className="mb-2">
              <strong>Epochs</strong>: {job.hyperparameters.n_epochs}
            </p>
            <Separator />

            <h3 className="text-lg font-semibold mb-2">Files</h3>
            <div className="mb-2 block">Training: {job.training_file}</div>
            <div className="mb-2 block">Validation: {job.validation_file}</div>

            <Separator />

            <h3 className="text-lg font-semibold mb-2 mt-12">Events</h3>
            {jobEvents.map(event => {
              if (event.type === 'metrics') return null
              return (
                <div key={event.id} className="mb-2 flex flex-row items-center">
                  <div className="text-xs mb-1 w-48">
                    {' '}
                    {new Date(event.created_at * 1000).toLocaleString('en-US', {
                      month: 'short',
                      day: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </div>
                  <div className="text-xs mb-1 ml-12">{event.message}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
