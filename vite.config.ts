import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

const PRODUCTION_LAYOUT_ENDPOINT = 'https://futurefabric-beryl.vercel.app/api/layout'

function localLayoutApi(): Plugin {
  return {
    name: 'futurefabric-local-layout-api',
    configureServer(server) {
      server.middlewares.use('/api/layout', async (request, response, next) => {
        if (request.method !== 'GET' && request.method !== 'PUT') {
          next()
          return
        }

        try {
          let body: string | undefined
          if (request.method === 'PUT') {
            body = ''
            request.setEncoding('utf8')
            for await (const chunk of request) body += chunk
          }

          const upstream = await fetch(PRODUCTION_LAYOUT_ENDPOINT, {
            method: request.method,
            headers: request.method === 'PUT' ? { 'content-type': 'application/json' } : undefined,
            body,
          })
          response.statusCode = upstream.status
          response.setHeader('content-type', upstream.headers.get('content-type') ?? 'application/json')
          response.setHeader('cache-control', 'no-store')
          response.end(await upstream.text())
        } catch {
          response.statusCode = 502
          response.setHeader('content-type', 'application/json')
          response.end(JSON.stringify({ error: 'Shared layout service is unavailable.' }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [localLayoutApi(), react()],
})
