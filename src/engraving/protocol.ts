/** Messages the app sends to the engraving worker. */
export type EngravingRequest =
  { type: 'load'; file: File } | { type: 'renderPage'; page: number }

/** Messages the engraving worker sends to the app. */
export type EngravingResponse =
  | { type: 'ready'; version: string }
  | { type: 'loaded'; pageCount: number }
  | { type: 'page'; svg: string }
  | { type: 'error'; message: string }
