/** Messages the engraving worker sends to the app. */
export type EngravingResponse =
  { type: 'ready'; version: string } | { type: 'error'; message: string }
