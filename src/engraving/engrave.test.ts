import { readdirSync, readFileSync } from 'node:fs'
import { beforeAll, describe, expect, it } from 'vitest'
import type { VerovioToolkit } from 'verovio/esm'
import { createToolkit, loadScore, renderPages } from './engrave'

const FIXTURES = new URL('../../tests/fixtures/musicxml/', import.meta.url)

/**
 * Page count of every fixture with the encoded breaks. These numbers are what
 * singers use to talk about the score ("page 2, top right"), so a change here
 * after a Verovio update must be a conscious decision.
 */
const EXPECTED_PAGES: Record<string, number> = {
  'mendelssohn-beati-mortui-ttbb.mxl': 4,
  'rheinberger-abendlied-ssattb.mxl': 4,
  'silcher-aennchen-von-tharau-satb.mxl': 7,
  'silcher-frisch-gesungen-satb.mxl': 1,
  'silcher-muss-i-denn-satb.mxl': 2,
  'tallis-if-ye-love-me-satb.mxl': 4,
}

/** Reads a fixture into an ArrayBuffer of exactly its own size. */
function readFixture(name: string): ArrayBuffer {
  // Node may place small files in a shared buffer pool, so copy the bytes
  // instead of using the Buffer's underlying ArrayBuffer directly
  return Uint8Array.from(readFileSync(new URL(name, FIXTURES))).buffer
}

describe('engraving', () => {
  let toolkit: VerovioToolkit

  // Loading the WebAssembly module takes a moment, so do it once
  beforeAll(async () => {
    toolkit = await createToolkit()
  })

  it('has an expected page count for every fixture', () => {
    const fixtures = readdirSync(FIXTURES).filter((name) =>
      name.endsWith('.mxl'),
    )
    expect(fixtures.sort()).toEqual(Object.keys(EXPECTED_PAGES).sort())
  })

  it.each(Object.entries(EXPECTED_PAGES))(
    'renders %s as %i A4 page(s)',
    (name, pageCount) => {
      loadScore(toolkit, readFixture(name), name)
      const pages = renderPages(toolkit)

      expect(pages).toHaveLength(pageCount)
      for (const svg of pages) {
        expect(svg).toContain('viewBox="0 0 2100 2970"')
      }
    },
  )

  it('rejects data that is not MusicXML', () => {
    const notMusic = new TextEncoder().encode('This is not a score').buffer
    expect(() => {
      loadScore(toolkit, notMusic, 'notes.txt')
    }).toThrow('Verovio could not read notes.txt')
  })
})
