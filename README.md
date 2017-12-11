# emailjs-tcp-proxy

[![Greenkeeper badge](https://badges.greenkeeper.io/emailjs/emailjs-tcp-proxy.svg)](https://greenkeeper.io/) [![Build Status](https://travis-ci.org/emailjs/emailjs-tcp-proxy.svg?branch=master)](https://travis-ci.org/emailjs/emailjs-tcp-proxy) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)  [![ES6+](https://camo.githubusercontent.com/567e52200713e0f0c05a5238d91e1d096292b338/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f65732d362b2d627269676874677265656e2e737667)](https://kangax.github.io/compat-table/es6/)

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
