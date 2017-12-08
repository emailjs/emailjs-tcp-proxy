import log from 'npmlog'
import express from 'express'
import { Server } from 'http'
import socketio from 'socket.io'
import net from 'net'
import os from 'os'
import morgan from 'morgan'

log.level = 'error'
const LOG_FORMAT = ':remote-addr [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer"'

export default (port) => new Promise((resolve) => {
  const app = express()
  const server = Server(app)
  const io = socketio(server)

  app.disable('x-powered-by')
  app.use(morgan(LOG_FORMAT, {
    stream: { write: (line = '') => line.trim() && log.http('express', line) }
  }))

  server.listen(port, function () {
    io.on('connection', onSocketIncoming)
    const {address, port} = server.address()
    log.info('express', 'Server listening on %s:%s', address, port)
    resolve(server)
  })
})

const onSocketIncoming = socket => {
  const id = socket.conn.id
  const remote = socket.conn.remoteAddress
  log.info('io', 'New connection [%s] from %s', id, remote)

  socket.on('open', ({ host, port }, fn) => {
    log.verbose('io', 'Open request to %s:%s [%s]', host, port, id)
    const tcp = net.connect(port, host, () => {
      log.verbose('io', 'Opened tcp connection to %s:%s [%s]', host, port, id)

      tcp.on('data', chunk => {
        log.silly('io', 'Received %s bytes from %s:%s [%s]', chunk.length, host, port, id)
        socket.emit('data', chunk)
      })

      tcp.on('error', err => {
        log.verbose('io', 'Error for %s:%s [%s]: %s', host, port, id, err.message)
        socket.emit('error', err.message)
      })

      tcp.on('end', () => socket.emit('end'))

      tcp.on('close', () => {
        log.verbose('io', 'Closed tcp connection to %s:%s [%s]', host, port, id)
        socket.emit('close')

        socket.removeAllListeners('data')
        socket.removeAllListeners('end')
      })

      socket.on('data', (chunk, fn) => {
        if (!chunk || !chunk.length) {
          if (typeof fn === 'function') {
            fn()
          }
          return
        }
        log.silly('io', 'Sending %s bytes to %s:%s [%s]', chunk.length, host, port, id)
        tcp.write(chunk, () => {
          if (typeof fn === 'function') {
            fn()
          }
        })
      })

      socket.on('end', () => {
        log.verbose('io', 'Received request to close connection to %s:%s [%s]', host, port, id)
        tcp.end()
      })

      if (typeof fn === 'function') {
        fn(os.hostname()) // reply with hostname once we're set up
      }

      socket.on('disconnect', function () {
        log.verbose('io', 'Closed connection [%s], closing connection to %s:%s ', id, host, port)
        tcp.end()
        socket.removeAllListeners()
      })
    })
  })
}
