import { serve } from 'srvx/node'
import { serveStatic } from 'srvx/static'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import app from './dist/server/server.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

serve({
  fetch: app.fetch,
  middleware: [serveStatic({ dir: join(__dirname, 'dist/client') })],
  port: Number(process.env.PORT) || 3000,
})
