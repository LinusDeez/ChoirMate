import { describe, expect, it } from 'vitest'
import { beatsToSeconds } from './tempo'

describe('beatsToSeconds', () => {
  it('converts one beat at 60 bpm to one second', () => {
    expect(beatsToSeconds(1, 60)).toBe(1)
  })

  it('converts four beats at 120 bpm to two seconds', () => {
    expect(beatsToSeconds(4, 120)).toBe(2)
  })

  it('throws for a non-positive tempo', () => {
    expect(() => beatsToSeconds(4, 0)).toThrow()
  })
})
