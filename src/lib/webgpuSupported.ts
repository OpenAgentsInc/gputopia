import { useEffect, useState } from 'react'

export function useWebgpuSupported() {
  const [webgpuSupported, setWebgpuSupported] = useState(null)

  useEffect(() => {
    const isWebGPUSupported = async () => {
      if ('gpu' in navigator) {
        const adapter = await navigator.gpu.requestAdapter()
        setWebgpuSupported(Boolean(adapter))
      } else {
        setWebgpuSupported(false)
      }
    }
    isWebGPUSupported()
  }, [])

  return webgpuSupported
}
