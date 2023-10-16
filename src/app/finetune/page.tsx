import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

export default function Finetune() {
  return (
    <div className="mt-12 bg-transparent min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Fine-tuning</h1>

      <div className="flex mb-8">
        <button className="px-4 py-2 border rounded mr-2">All</button>
        <button className="px-4 py-2 border rounded mr-2">Successful</button>
        <button className="px-4 py-2 border rounded">Failed</button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="border p-4 mb-8">
            <h2 className="text-xl font-semibold mb-4">my-custom-mistral</h2>
            <p>10/16/2023, 3:57 PM</p>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold">MODEL</h3>
          <h3 className="text-lg font-semibold mb-8">my-custom-mistral</h3>
          <p className="mb-2">
            <strong>Job ID</strong>: ft-job-ei4DHpF5UtWnAp5qjTKPCcn
          </p>
          <p className="mb-2">
            <strong>Base model</strong>: mistral-7b
          </p>
          <p className="mb-2">
            <strong>Created at</strong>: Oct 16, 2023, 3:57 PM
          </p>
          <Separator />
          <p className="mb-2">
            <strong>Trained tokens</strong>: 1900
          </p>
          <p className="mb-2">
            <strong>Epochs</strong>: 10
          </p>
          <Separator />

          <h3 className="text-lg font-semibold mb-2">Files</h3>
          <Link href="#" className="text-blue-500 mb-2 block">
            Training: finetunedemo.json
          </Link>
          <Link href="#" className="text-blue-500 mb-2 block">
            Validation: finetunedemo-validation.json
          </Link>

          <Separator />
          <p>Training Loss: 3.5806</p>
          <p>Validation Loss: 4.1239</p>

          <Separator />

          <div className="mt-4">
            <div className="mt-4">
              <ul>
                <li>16:00:42 - The job has successfully completed</li>
                <li>16:00:40 - New fine-tuned model created: ft:davinci-002:arcade-labs::8AO3Tcpr</li>
                <li>15:58:07 - Fine-tuning job started</li>
                <li>15:58:02 - Files validated, moving job to queued state</li>
                <li>
                  15:57:58 - Validating training file: file-BClNG5FYvATb4qGFC32x6dOP and validation file:
                  file-KRybPDQ03Jz7EpUxdhkstCE4
                </li>
                <li>15:57:58 - Created fine-tuning job: ftjob-ei4DFHpF5UIwnAp5qjKIPCCn</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
