/**
 * Converts a number of beats to seconds at the given tempo.
 * @param beats - number of beats (quarter notes in 4/4)
 * @param bpm - tempo in beats per minute, must be positive
 */
export function beatsToSeconds(beats: number, bpm: number): number {
  if (bpm <= 0) {
    throw new Error(`Tempo must be positive, got ${String(bpm)} bpm`)
  }

  const secondsPerBeat = 60 / bpm
  return beats * secondsPerBeat
}
