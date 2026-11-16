import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import type { EngravingRequest, EngravingResponse } from './engraving/protocol'
import { usePageTurner } from './ui/usePageTurner'
import './App.css'

function App() {
  const workerRef = useRef<Worker | null>(null)
  const [status, setStatus] = useState('Loading engraving engine…')
  const [pages, setPages] = useState<string[]>([])
  const toolbarRef = useRef<HTMLElement>(null)
  const scoreRef = useRef<HTMLDivElement>(null)
  const turn = usePageTurner(scoreRef, toolbarRef)

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
        case 'score':
          setStatus('Score ready')
          setPages(message.pages)
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
    // Hide the previous score until the new one has arrived
    setPages([])
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
      {pages.length > 0 && (
        <nav ref={toolbarRef} className="page-nav">
          <button type="button" onClick={() => turn('previous')}>
            Previous
          </button>
          <button type="button" onClick={() => turn('next')}>
            Next
          </button>
        </nav>
      )}
      <div ref={scoreRef} className="score">
        {pages.map((svg, index) => (
          // The page list is only ever replaced as a whole, so the index is a
          // stable key here
          <figure key={index} className="score-page">
            <div dangerouslySetInnerHTML={{ __html: svg }} />
            <figcaption>Page {index + 1}</figcaption>
          </figure>
        ))}
      </div>
    </main>
  )
}

export default App
