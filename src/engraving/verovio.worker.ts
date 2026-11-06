import createVerovioModule from 'verovio/wasm'
import { VerovioToolkit } from 'verovio/esm'
import type { EngravingRequest, EngravingResponse } from './protocol'

function send(message: EngravingResponse): void {
  self.postMessage(message)
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

async function createToolkit(): Promise<VerovioToolkit> {
  const module = await createVerovioModule()
  const toolkit = new VerovioToolkit(module)
  toolkit.setOptions({ adjustPageHeight: true, scale: 40 })
  return toolkit
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

/** Compressed MusicXML (.mxl) is a ZIP archive; ZIP files start with "PK". */
function isZip(data: ArrayBuffer): boolean {
  const bytes = new Uint8Array(data)
  return bytes[0] === 0x50 && bytes[1] === 0x4b
}

async function load(file: File): Promise<void> {
  const toolkit = await toolkitPromise
  const data = await file.arrayBuffer()
  const ok = isZip(data)
    ? toolkit.loadZipDataBuffer(data)
    : toolkit.loadData(new TextDecoder().decode(data))
  if (!ok) {
    throw new Error(`Verovio could not read ${file.name}`)
  }
  send({
    type: 'loaded',
    pageCount: toolkit.getPageCount(),
    svg: toolkit.renderToSVG(1),
  })
}

self.onmessage = (event: MessageEvent<EngravingRequest>) => {
  load(event.data.file).catch((error: unknown) => {
    send({ type: 'error', message: errorMessage(error) })
  })
}
