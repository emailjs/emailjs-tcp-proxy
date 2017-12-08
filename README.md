# emailjs-tcp-proxy

Tunnels tcp connections to socketio without TLS termination

## Usage as library to use in your own services

```javascript
import attachProxy from 'emailjs-tcp-proxy'
import express from 'express'
import { Server } from 'http'

const server = Server(express())
server.listen(12345, () => {
  attachProxy(server)
})
```

## Usage as standalone

```bash
git clone git@github.com:emailjs/emailjs-tcp-proxy.git
cd emailjs-tcp-proxy
PROXY_PORT=1234 npm start
```
