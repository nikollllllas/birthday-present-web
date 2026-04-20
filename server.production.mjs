import { serve } from 'srvx/node'
import app from './dist/server/server.js'

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT) || 3000,
})
