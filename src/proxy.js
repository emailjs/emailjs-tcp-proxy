import log from 'npmlog'
import config from 'config'
import express from 'express'
import { Server } from 'http'
import socketio from 'socket.io'
import net from 'net'
import os from 'os'
import morgan from 'morgan'

log.level = config.log.level

export default () => new Promise((resolve) => {
  const app = express()
  const server = Server(app)
  const io = socketio(server)

  app.disable('x-powered-by')
  app.use(morgan(config.log.http, {
    stream: { write: (line = '') => line.trim() && log.http('express', line) }
  }))

  server.listen(config.server.port, config.server.host, function () {
    io.on('connection', onSocketIncoming)
    const {address, port} = server.address()
    log.info('express', 'Server listening on %s:%s', address, port)
    resolve(server)
  })
})

const onSocketIncoming = socket => {
  log.info('io', 'New connection [%s] from %s', socket.conn.id, socket.conn.remoteAddress)

  socket.on('open', (data, fn) => {
    log.verbose('io', 'Open request to %s:%s [%s]', data.host, data.port, socket.conn.id)
    const tcp = net.connect(data.port, data.host, () => {
      log.verbose('io', 'Opened tcp connection to %s:%s [%s]', data.host, data.port, socket.conn.id)

      tcp.on('data', chunk => {
        log.silly('io', 'Received %s bytes from %s:%s [%s]', chunk.length, data.host, data.port, socket.conn.id)
        socket.emit('data', chunk)
      })

      tcp.on('error', err => {
        log.verbose('io', 'Error for %s:%s [%s]: %s', data.host, data.port, socket.conn.id, err.message)
        socket.emit('error', err.message)
      })

      tcp.on('end', () => socket.emit('end'))

      tcp.on('close', () => {
        log.verbose('io', 'Closed tcp connection to %s:%s [%s]', data.host, data.port, socket.conn.id)
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
        log.silly('io', 'Sending %s bytes to %s:%s [%s]', chunk.length, data.host, data.port, socket.conn.id)
        tcp.write(chunk, () => {
          if (typeof fn === 'function') {
            fn()
          }
        })
      })

      socket.on('end', () => {
        log.verbose('io', 'Received request to close connection to %s:%s [%s]', data.host, data.port, socket.conn.id)
        tcp.end()
      })

      if (typeof fn === 'function') {
        fn(os.hostname()) // reply with hostname once we're set up
      }

      socket.on('disconnect', function () {
        log.verbose('io', 'Closed connection [%s], closing connection to %s:%s ', socket.conn.id, data.host, data.port)
        tcp.end()
        socket.removeAllListeners()
      })
    })
  })
}
