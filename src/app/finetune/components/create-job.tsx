import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ModelSelector } from './model-selector'
import { models, types } from '../../playground/data/models'

export function CreateJob() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create new</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>Create a fine-tuned model</DialogTitle>
          {/* <DialogDescription>
            This will save the current playground state as a preset which you can access later or share with
            others.
          </DialogDescription> */}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <ModelSelector models={models} types={types} />
            {/* <Label htmlFor="name">Name</Label>
            <Input id="name" autoFocus /> */}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Training data</Label>
            <Input id="description" type="file" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Validation data</Label>
            <Input id="description" type="file" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
