import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import type { EngravingRequest, EngravingResponse } from './engraving/protocol'

function App() {
  const workerRef = useRef<Worker | null>(null)
  const [status, setStatus] = useState('Loading engraving engine…')
  const [svg, setSvg] = useState<string | null>(null)

  useEffect(() => {
    const worker = new Worker(
      new URL('./engraving/verovio.worker.ts', import.meta.url),
      { type: 'module' },
    )
    workerRef.current = worker

    worker.onmessage = (event: MessageEvent<EngravingResponse>) => {
      const message = event.data
      switch (message.type) {
        case 'ready':
          setStatus(`Verovio ${message.version} ready`)
          break
        case 'loaded':
          setStatus(`Page 1 of ${String(message.pageCount)}`)
          setSvg(message.svg)
          break
        case 'error':
          setStatus(`Error: ${message.message}`)
          break
      }
    }

    // Runs on unmount (and twice in dev because of StrictMode)
    return () => {
      worker.terminate()
      workerRef.current = null
    }
  }, [])

  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0]
    if (!file || !workerRef.current) {
      return
    }
    setStatus(`Engraving ${file.name}…`)
    const request: EngravingRequest = { type: 'load', file }
    workerRef.current.postMessage(request)
  }

  return (
    <main>
      <h1>ChoirMate</h1>
      <input
        type="file"
        accept=".mxl,.musicxml,.xml"
        onChange={handleFileChange}
      />
      <p>{status}</p>
      {svg !== null && <div dangerouslySetInnerHTML={{ __html: svg }} />}
    </main>
  )
}

export default App
