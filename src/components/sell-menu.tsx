'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger
} from '@/components/ui/menubar'
import { useStore } from '@/lib/store'
import { useWebgpuSupported } from '@/lib/webgpuSupported'
import { generate, initModel, unloadModel } from '@/lib/webllm'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { useMachineId } from '@/lib/hooks/use-machine-id'
import { useSession } from 'next-auth/react'

enum ModelType {
  'vicuna' = 'vicuna-v1-7b-q4f32_0',
  'llama2-7b' = 'Llama-2-7b-chat-hf-q4f32_1',
  'llama2-13b' = 'Llama-2-13b-chat-hf-q4f16_1'
}

export function SellMenu() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [modelLoading, setModelLoading] = useState(false)
  const [modelLoaded, setModelLoaded] = useState(false)

  const user = useStore(state => state.user) as AlbyUser
  const userId = session?.user?.user_id
  const machineId = useMachineId()

  const searchParams = useSearchParams()
  const debug = !!searchParams.get('debug')

  const modelLoadPercentage = useStore(state => state.modelLoadPercentage)

  const supported = useWebgpuSupported()

  const [selectedModel, setSelectedModel] = useState<ModelType>(ModelType.vicuna)

  const changeModel = async (model: ModelType) => {
    if (modelLoaded || modelLoading) {
      await unloadModel()
      setModelLoaded(false)
      setModelLoading(false)
    }
    setSelectedModel(model)
  }

  useEffect(() => {
    document.addEventListener('model-loaded', function () {
      console.log('Model loaded')
      setModelLoading(false)
      setModelLoaded(true)
      try {
        window.pusher?.subscribe(`presence-serving-vicuna`)
      } catch (e) {
        console.log('Couldnt join vicuna serving presence')
      }
    })
  }, [])
  return (
    <>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Buy</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => router.push('/chat')}>AI Chat</MenubarItem>
            <MenubarItem onClick={() => router.push('/api-key')}>API Key</MenubarItem>
            {/* <MenubarSeparator />
            <MenubarItem disabled>
              Reserve capacity...
            </MenubarItem> */}
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Sell</MenubarTrigger>
          <MenubarContent>
            <MenubarItem
              disabled={modelLoading || modelLoaded}
              onClick={() => {
                if (supported === false) {
                  useStore.setState({ showWebgpuWarning: true })
                  return
                }

                useStore.setState({ modelLoadPercentage: 0 })
                setModelLoading(true)
                initModel(user.lightning_address, userId, debug, machineId)
              }}
            >
              Load model
            </MenubarItem>
            <MenubarSub>
              <MenubarSubTrigger>Set model</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarRadioGroup value={selectedModel}>
                  <MenubarRadioItem value={ModelType.vicuna} onClick={() => changeModel(ModelType.vicuna)}>
                    Vicuna 7B
                  </MenubarRadioItem>
                  <MenubarRadioItem
                    disabled
                    value={ModelType['llama2-7b']}
                    onClick={() => changeModel(ModelType['llama2-7b'])}
                  >
                    Llama2 7B
                  </MenubarRadioItem>
                  <MenubarRadioItem
                    disabled
                    value={ModelType['llama2-13b']}
                    onClick={() => changeModel(ModelType['llama2-13b'])}
                  >
                    Llama2 13B
                  </MenubarRadioItem>
                </MenubarRadioGroup>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarItem
              disabled={!modelLoaded}
              onClick={async () => {
                await unloadModel()
                setModelLoading(false)
                setModelLoaded(false)
              }}
            >
              Unload model
            </MenubarItem>
            {/* <MenubarItem disabled={!modelLoaded} onClick={async () => {
              generate("Say hello to my little friend")
            }}>
              Test generate
            </MenubarItem> */}
            {/* <MenubarSeparator />
            <MenubarItem disabled>
              Connect workerbee...
            </MenubarItem> */}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <div className="h-12 w-48 flex items-center">
        {modelLoading && !modelLoaded ? (
          <div className="w-full flex flex-row items-center">
            <div id="perc" className="text-lg w-10 text-right font-mono"></div>
            <Progress value={modelLoadPercentage} className="mx-4 w-[60%]" />
          </div>
        ) : (
          <></>
        )}
        {modelLoaded && !modelLoading ? (
          <p className="ml-4 text-xs text-muted-foreground">Model loaded</p>
        ) : (
          // <p className="ml-4 text-xs text-muted-foreground">Loaded {selectedModel}</p>
          <></>
        )}
      </div>
    </>
  )
}
