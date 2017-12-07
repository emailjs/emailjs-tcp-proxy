import cluster from 'cluster'
import config from 'config'
import log from 'npmlog'
import startProxy from './proxy'

log.level = config.log.level

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
  startProxy()
}
