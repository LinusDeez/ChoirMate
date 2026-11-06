import { useEffect, useState } from 'react'
import type { EngravingResponse } from './engraving/protocol'

function App() {
  const [status, setStatus] = useState('Loading engraving engine…')

  useEffect(() => {
    const worker = new Worker(
      new URL('./engraving/verovio.worker.ts', import.meta.url),
      { type: 'module' },
    )

    worker.onmessage = (event: MessageEvent<EngravingResponse>) => {
      const message = event.data
      switch (message.type) {
        case 'ready':
          setStatus(`Verovio ${message.version} ready`)
          break
        case 'error':
          setStatus(`Engraving engine failed: ${message.message}`)
          break
      }
    }

    // Runs on unmount (and twice in dev because of StrictMode)
    return () => {
      worker.terminate()
    }
  }, [])

  return (
    <main>
      <h1>ChoirMate</h1>
      <p>{status}</p>
    </main>
  )
}

export default App
