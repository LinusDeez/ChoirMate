import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import type { EngravingRequest, EngravingResponse } from './engraving/protocol'
import './App.css'

function App() {
  const workerRef = useRef<Worker | null>(null)
  const [status, setStatus] = useState('Loading engraving engine…')
  const [pageCount, setPageCount] = useState(0)
  const [page, setPage] = useState(1)
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
          setStatus('Score loaded')
          setPageCount(message.pageCount)
          break
        case 'page':
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

  function sendToWorker(request: EngravingRequest): void {
    workerRef.current?.postMessage(request)
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }
    setStatus(`Engraving ${file.name}…`)
    // Forget the previous score until the new one has arrived
    setPageCount(0)
    setPage(1)
    setSvg(null)
    sendToWorker({ type: 'load', file })
  }

  function goToPage(newPage: number): void {
    setPage(newPage)
    sendToWorker({ type: 'renderPage', page: newPage })
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
      {pageCount > 0 && (
        <nav className="page-nav">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
          >
            Previous
          </button>
          <span>
            Page {page} of {pageCount}
          </span>
          <button
            type="button"
            disabled={page >= pageCount}
            onClick={() => goToPage(page + 1)}
          >
            Next
          </button>
        </nav>
      )}
      {svg !== null && <div dangerouslySetInnerHTML={{ __html: svg }} />}
    </main>
  )
}

export default App
