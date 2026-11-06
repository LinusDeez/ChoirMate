import createVerovioModule from 'verovio/wasm'
import { VerovioToolkit } from 'verovio/esm'
import type { EngravingResponse } from './protocol'

function send(message: EngravingResponse): void {
  self.postMessage(message)
}

async function init(): Promise<void> {
  const module = await createVerovioModule()
  const toolkit = new VerovioToolkit(module)
  send({ type: 'ready', version: toolkit.getVersion() })
}

init().catch((error: unknown) => {
  send({
    type: 'error',
    message: error instanceof Error ? error.message : String(error),
  })
})
