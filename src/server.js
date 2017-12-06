import cluster from 'cluster'
import config from 'config'
import log from 'npmlog'
import os from 'os'
import express from 'express'
import { Server } from 'http'
import socketio from 'socket.io'
import net from 'net'

log.level = config.log.level

// Handle error conditions
process.on('SIGTERM', function () {
  log.warn('exit', 'Exited on SIGTERM')
  process.exit(0)
})

process.on('SIGINT', function () {
  log.warn('exit', 'Exited on SIGINT')
  process.exit(0)
})

process.on('uncaughtException', function (err) {
  log.error('uncaughtException ', err)
  process.exit(1)
})

if (cluster.isMaster) {
  cluster.on('fork', function (worker) {
    log.info('cluster', 'Forked worker #%s [pid:%s]', worker.id, worker.process.pid)
  })

  cluster.on('exit', function (worker) {
    log.warn('cluster', 'Worker #%s [pid:%s] died', worker.id, worker.process.pid)
    setTimeout(() => { cluster.fork() }, 1000)
  })

  cluster.fork()
} else {
  const app = express()
  const server = Server(app)
  const io = socketio(server)

  // Setup logger. Stream all http logs to general logger
  app.use(require('morgan')(config.log.http, {
    'stream': {
      'write': function (line = '') {
        line.trim() && log.http('express', line)
      }
    }
  }))

  // Do not advertise Express
  app.disable('x-powered-by')

  io.on('connection', socket => {
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

        // reply with hostname once we're set up
        if (typeof fn === 'function') {
          fn(os.hostname())
        }

        socket.on('disconnect', function () {
          log.verbose('io', 'Closed connection [%s], closing connection to %s:%s ', socket.conn.id, data.host, data.port)
          tcp.end()
          socket.removeAllListeners()
        })
      })
    })
  })

  server.listen(config.server.port, config.server.host, function () {
    var address = server.address()
    log.info('express', 'Server listening on %s:%s', address.address, address.port)
  })
}
