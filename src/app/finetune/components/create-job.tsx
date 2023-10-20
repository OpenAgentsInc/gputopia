import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ModelSelector } from './model-selector'
import { models, types } from '../../playground/data/models'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function CreateJob() {
  const [trainingFile, setTrainingFile] = useState(null)
  const [validationFile, setValidationFile] = useState(null)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleSubmit = async e => {
    e.preventDefault()
    if (!trainingFile || !validationFile) return

    const formData = new FormData()
    formData.append('trainingData', trainingFile)
    formData.append('validationData', validationFile)

    // Make API request
    const res = await fetch('/api/finetuning-jobs', {
      method: 'POST',
      body: formData
    })

    if (res.ok) {
      const json = await res.json()
      setOpen(false)
      router.push(`/finetune/${json.finetuneId}`)
    } else {
      alert('Something went wrong. Please try again.')
    }
  }
  return (
    <Dialog open={open} onOpenChange={opennow => setOpen(opennow)}>
      <DialogTrigger asChild>
        <Button>Create new</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>Create a fine-tuned model</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <ModelSelector models={models} types={types} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Training data</Label>
              <Input id="description" type="file" onChange={e => setTrainingFile(e.target.files[0])} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Validation data</Label>
              <Input id="description" type="file" onChange={e => setValidationFile(e.target.files[0])} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
