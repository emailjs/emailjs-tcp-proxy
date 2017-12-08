/* eslint-disable no-unused-expressions */

import io from 'socket.io-client'
import net from 'net'
import attachProxy from './proxy'
import express from 'express'
import { Server } from 'http'

describe('WebSocket Shim', () => {
  const buffer = Uint8Array.from([1, 2, 3]).buffer
  const proxyPort = 8888
  let proxy
  const echoPort = 8889
  let echo

  before((done) => {
    proxy = Server(express())
    proxy.listen(proxyPort, () => {
      attachProxy(proxy)
      done()
    })
  })

  beforeEach((done) => {
    echo = net.createServer(socket => socket.pipe(socket))
    echo.listen(echoPort, done)
  })

  afterEach((done) => {
    echo.close(done)
  })

  after(done => {
    proxy.close(done)
  })

  it('should send and receive data from echo server', (done) => {
    const webSocket = io(`http://localhost:${proxyPort}/`)
    webSocket.on('data', data => {
      expect(nodeBuffertoArrayBuffer(data)).to.deep.equal(buffer)
      webSocket.disconnect()
    })
    webSocket.on('disconnect', () => {
      done()
    })
    webSocket.emit('open', { host: 'localhost', port: echoPort }, hostname => {
      expect(hostname).to.exist
      webSocket.emit('data', buffer)
    })
  })
})

const nodeBuffertoArrayBuffer = buf => Uint8Array.from(buf).buffer
