import createVerovioModule from 'verovio/wasm'
import { VerovioToolkit } from 'verovio/esm'

/*
 * Engraving with Verovio, independent of where it runs: the Web Worker uses
 * these functions in the browser, the tests use them in Node.
 */

export async function createToolkit(): Promise<VerovioToolkit> {
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

/** Compressed MusicXML (.mxl) is a ZIP archive; ZIP files start with "PK". */
function isZip(data: ArrayBuffer): boolean {
  const bytes = new Uint8Array(data)
  return bytes[0] === 0x50 && bytes[1] === 0x4b
}

/**
 * Loads compressed (.mxl) or plain MusicXML into the toolkit.
 * Throws if Verovio cannot read the data.
 */
export function loadScore(
  toolkit: VerovioToolkit,
  data: ArrayBuffer,
  fileName: string,
): void {
  const ok = isZip(data)
    ? toolkit.loadZipDataBuffer(data)
    : toolkit.loadData(new TextDecoder().decode(data))
  if (!ok) {
    throw new Error(`Verovio could not read ${fileName}`)
  }
}

/** Renders every page of the loaded score as SVG. */
export function renderPages(toolkit: VerovioToolkit): string[] {
  // Verovio numbers pages from 1
  return Array.from({ length: toolkit.getPageCount() }, (_, index) =>
    toolkit.renderToSVG(index + 1),
  )
}
