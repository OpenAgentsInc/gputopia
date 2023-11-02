'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

import { useState } from 'react'

import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'

export function PreviewToken() {
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>('ai-token', null)
  const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW)
  const [previewTokenInput, setPreviewTokenInput] = useState(previewToken ?? '')

  return (
    <Dialog open={previewTokenDialog} onOpenChange={setPreviewTokenDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter your OpenAI Key</DialogTitle>
          <DialogDescription>
            If you have not obtained your OpenAI API key, you can do so by{' '}
            <a href="https://platform.openai.com/signup/" className="underline">
              signing up
            </a>{' '}
            on the OpenAI website. This is only necessary for preview environments so that the open source
            community can test the app. The token will be saved to your browser&apos;s local storage under the
            name <code className="font-mono">ai-token</code>.
          </DialogDescription>
        </DialogHeader>
        <Input
          value={previewTokenInput}
          placeholder="OpenAI API key"
          onChange={e => setPreviewTokenInput(e.target.value)}
        />
        <DialogFooter className="items-center">
          <Button
            onClick={() => {
              setPreviewToken(previewTokenInput)
              setPreviewTokenDialog(false)
            }}
          >
            Save Token
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
