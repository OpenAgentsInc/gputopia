'use client'

import { ArrowTopRightIcon, ChevronDownIcon } from '@radix-ui/react-icons'
import { IconPlanet } from '../../../components/ui/icons'
import { ChatModel, availableModels } from '@/lib/chat'
import { useStore } from '@/lib/store'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export function EmptyScreen() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const selectedModel = useStore(state => state.selectedModel)

  return (
    <div className="mx-auto max-w-5xl px-4 pt-12 my-auto grid gap-2 xl:gap-8 lg:grid-cols-3">
      <div className="lg:col-span-1 bg-background p-2">
        <h1 className="mb-3 text-lg font-semibold">Welcome to GPUtopia AI Chat</h1>
        <p className="mb-3 leading-normal text-muted-foreground">
          This is a chatbot using swarm AI, a decentralized network of GPU nodes.
        </p>
        <p className="mb-3 leading-normal text-muted-foreground">
          Inferences are paid in bitcoin sats, for now 7 sats per Vicuna inference. GPUtopia takes a 1-sat
          platform fee and the rest goes to the provider of the GPU compute that processes the inference.
        </p>
        <p className="mb-3 leading-normal text-muted-foreground">
          Conversations are not saved. Your messages are not shared, but also not private. Don&apos;t share
          sensitive information.
        </p>
      </div>
      <div className="lg:col-span-2 bg-background p-2 max-w-lg">
        <div className="overflow-hidden rounded-xl border-2 dark:border-gray-800">
          <div className="flex p-3">
            <div>
              <div className="text-sm text-gray-300 dark:text-gray-400" data-svelte-h="svelte-15leidr">
                Current Model
              </div>
              <div className="font-semibold">{selectedModel.displayName}</div>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="btn ml-auto flex h-7 w-7 self-start rounded-full bg-gray-100 p-1 text-xs hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-600"
                >
                  <ChevronDownIcon color="black" height={20} width={20} />
                </button>
              </DialogTrigger>
              <ChatDialog setDialogOpen={setDialogOpen} />
            </Dialog>
          </div>
          <div className="flex items-center gap-5 rounded-xl bg-gray-300 px-3 py-2 text-xs sm:text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            <a
              href={selectedModel.page}
              target="_blank"
              rel="noreferrer"
              className="flex items-center hover:underline"
            >
              <ArrowTopRightIcon className="mr-2" /> Model
              <div className="max-sm:hidden" data-svelte-h="svelte-cuulvl">
                &nbsp;page
              </div>
            </a>
            <a
              href={selectedModel.website}
              target="_blank"
              className="ml-auto flex items-center hover:underline"
              rel="noreferrer"
            >
              <IconPlanet className="mr-2" /> Website
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function ChatDialog({ setDialogOpen }: { setDialogOpen: any }) {
  const models = availableModels
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader className="mb-4">
        <DialogTitle>Models</DialogTitle>
      </DialogHeader>
      {models.map(model => {
        return <DialogModel key={model.name} model={model} setDialogOpen={setDialogOpen} />
      })}
    </DialogContent>
  )
}

function DialogModel({ model, setDialogOpen }: { model: ChatModel; setDialogOpen: any }) {
  return (
    <div>
      <div className="overflow-hidden rounded-xl border-2 dark:border-gray-800">
        <div
          className="flex p-3 cursor-pointer"
          onClick={() => {
            useStore.setState({ selectedModel: model })
            setDialogOpen(false)
          }}
        >
          <div>
            <div className="font-semibold">{model.displayName}</div>
            <div className="text-sm text-gray-300">{model.description}</div>
          </div>
        </div>
        <div className="flex items-center gap-5 rounded-xl bg-gray-300 px-3 py-2 text-xs sm:text-sm text-gray-600 ">
          {model.page && (
            <a
              href={model.page}
              target="_blank"
              rel="noreferrer"
              className="flex items-center hover:underline"
            >
              <ArrowTopRightIcon className="mr-2" /> Model page
            </a>
          )}
          {model.website && (
            <a
              href={model.website}
              target="_blank"
              className="ml-auto flex items-center hover:underline"
              rel="noreferrer"
            >
              <IconPlanet className="mr-2" /> Website
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
