import cluster from 'cluster'
import log from 'npmlog'
import attachProxy from './proxy'
import morgan from 'morgan'
import express from 'express'
import { Server } from 'http'

const LOG_FORMAT = ':remote-addr [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer"'

log.level = 'silly'
const port = process.env.PROXY_PORT || 8888

const exit = (signal, exitCode) => () => {
  log.warn('exit', `Exited on ${signal}`)
  process.exit(exitCode)
}

process.on('SIGINT', exit('SIGINT', 1))
process.on('SIGUSR1', exit('SIGUSR1', 1))
process.on('SIGUSR2', exit('SIGUSR2', 1))
process.on('uncaughtException', exit('Uncaught exception', 1))
process.on('SIGTERM', exit('SIGTERM', 0))
process.on('SIGINT', exit('SIGINT', 0))
process.on('uncaughtException', exit('uncaughtException', 1))
process.on('exit', () => {
  if (cluster.isMaster) {
    for (var id in cluster.workers) {
      cluster.workers[id].kill()
    }
  }
  exit(0)()
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
  app.disable('x-powered-by')
  app.use(morgan(LOG_FORMAT, {
    stream: { write: (line = '') => line.trim() && log.http('express', line) }
  }))
  server.listen(port, function () {
    const { address, port } = server.address()
    attachProxy(server, log)
    log.info('express', 'Server listening on %s:%s', address, port)
  })
}
