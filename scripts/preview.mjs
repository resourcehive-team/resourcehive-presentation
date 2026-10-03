import { createServer } from 'node:http'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { resolve, extname, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../dist/', import.meta.url))
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.png': 'image/png', '.json': 'application/json' }
if (!existsSync(resolve(root, 'index.html'))) throw new Error('Run pnpm build before pnpm preview.')

createServer((request, response) => {
  let path
  try {
    path = resolve(root, `.${decodeURIComponent(new URL(request.url, 'http://localhost').pathname)}`)
  } catch {
    response.writeHead(400).end('Invalid path')
    return
  }
  if (path !== resolve(root) && !path.startsWith(resolve(root) + sep)) {
    response.writeHead(403).end('Forbidden')
    return
  }
  if (!existsSync(path) || statSync(path).isDirectory()) {
    if (extname(path)) {
      response.writeHead(404).end('Not found')
      return
    }
    path = resolve(root, 'index.html')
  }
  response.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream' })
  const stream = createReadStream(path)
  stream.on('error', () => {
    if (!response.headersSent) response.writeHead(503).end('Build output is temporarily unavailable. Try again after the build finishes.')
    else response.destroy()
  })
  stream.pipe(response)
}).listen(3031, '127.0.0.1', () => console.log('Built deck: http://127.0.0.1:3031'))
