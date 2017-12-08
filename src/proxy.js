import socketio from 'socket.io'
import net from 'net'
import os from 'os'

export default (server, log) => {
  socketio(server).on('connection', socket => {
    const id = socket.conn.id
    const remote = socket.conn.remoteAddress
    log && log.info('io', 'New connection [%s] from %s', id, remote)

    socket.on('open', ({ host, port }, fn) => {
      log && log.verbose('io', 'Open request to %s:%s [%s]', host, port, id)
      const tcp = net.connect(port, host, () => {
        log && log.verbose('io', 'Opened tcp connection to %s:%s [%s]', host, port, id)

        tcp.on('data', chunk => {
          log && log.silly('io', 'Received %s bytes from %s:%s [%s]', chunk.length, host, port, id)
          socket.emit('data', chunk)
        })

        tcp.on('error', err => {
          log && log.verbose('io', 'Error for %s:%s [%s]: %s', host, port, id, err.message)
          socket.emit('error', err.message)
        })

        tcp.on('end', () => socket.emit('end'))

        tcp.on('close', () => {
          log && log.verbose('io', 'Closed tcp connection to %s:%s [%s]', host, port, id)
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
          log && log.silly('io', 'Sending %s bytes to %s:%s [%s]', chunk.length, host, port, id)
          tcp.write(chunk, () => {
            if (typeof fn === 'function') {
              fn()
            }
          })
        })

        socket.on('end', () => {
          log && log.verbose('io', 'Received request to close connection to %s:%s [%s]', host, port, id)
          tcp.end()
        })

        if (typeof fn === 'function') {
          fn(os.hostname()) // reply with hostname once we're set up
        }

        socket.on('disconnect', function () {
          log && log.verbose('io', 'Closed connection [%s], closing connection to %s:%s ', id, host, port)
          tcp.end()
          socket.removeAllListeners()
        })
      })
    })
  })
}
