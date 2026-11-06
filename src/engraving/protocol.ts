/** Messages the app sends to the engraving worker (only one kind so far). */
export interface EngravingRequest {
  type: 'load'
  file: File
}

/** Messages the engraving worker sends to the app. */
export type EngravingResponse =
  | { type: 'ready'; version: string }
  | { type: 'loaded'; pageCount: number; svg: string }
  | { type: 'error'; message: string }
