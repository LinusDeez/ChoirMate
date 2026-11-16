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
  toolkit.setOptions({
    // Fixed A4 pages (in tenths of a millimetre), so page numbers mean the
    // same thing on every screen
    pageWidth: 2100,
    pageHeight: 2970,
    // Keep the system and page breaks of the original edition. Without
    // encoded breaks, Verovio falls back to its automatic layout.
    breaks: 'encoded',
    // Let the browser scale the SVG to any size
    svgViewBox: true,
  })
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
  // Verovio numbers pages from 1
  const pages = Array.from({ length: toolkit.getPageCount() }, (_, index) =>
    toolkit.renderToSVG(index + 1),
  )
  send({ type: 'score', pages })
}

self.onmessage = (event: MessageEvent<EngravingRequest>) => {
  load(event.data.file).catch((error: unknown) => {
    send({ type: 'error', message: errorMessage(error) })
  })
}
