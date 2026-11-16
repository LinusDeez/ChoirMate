import { createToolkit, loadScore, renderPages } from './engrave'
import type { EngravingRequest, EngravingResponse } from './protocol'

function send(message: EngravingResponse): void {
  self.postMessage(message)
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

// Start loading immediately; requests that arrive earlier wait for it.
const toolkitPromise = createToolkit()

toolkitPromise.then(
  (toolkit) => {
    send({ type: 'ready', version: toolkit.getVersion() })
  },
  (error: unknown) => {
    send({ type: 'error', message: errorMessage(error) })
  },
)

async function load(file: File): Promise<void> {
  const toolkit = await toolkitPromise
  loadScore(toolkit, await file.arrayBuffer(), file.name)
  send({ type: 'score', pages: renderPages(toolkit) })
}

self.onmessage = (event: MessageEvent<EngravingRequest>) => {
  load(event.data.file).catch((error: unknown) => {
    send({ type: 'error', message: errorMessage(error) })
  })
}
