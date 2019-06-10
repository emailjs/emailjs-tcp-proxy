# emailjs-tcp-proxy

## DEPRECATION NOTICE

This project is not actively being maintained. If you're sending emails on a node.js-esque platform, please use Andris Reinman's [nodemailer](https://github.com/nodemailer/nodemailer). It is actively supported, more widely used and maintained offers more possibilities for sending mails than this project.

Background: This project was created because there was no option of using SMTP in a browser environment. This use case has been eliminated since Chrome Apps reached end of life and Firefox OS was scrapped. If you're on an electron-based platform, please use the capabilities that come with a full fledged node.js backend.

If you still feel this project has merit and you would like to be a maintainer, please reach out to me.



[![Greenkeeper badge](https://badges.greenkeeper.io/emailjs/emailjs-tcp-proxy.svg)](https://greenkeeper.io/) [![Build Status](https://travis-ci.org/emailjs/emailjs-tcp-proxy.svg?branch=master)](https://travis-ci.org/emailjs/emailjs-tcp-proxy) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)  [![ES6+](https://camo.githubusercontent.com/567e52200713e0f0c05a5238d91e1d096292b338/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f65732d362b2d627269676874677265656e2e737667)](https://kangax.github.io/compat-table/es6/)

Tunnels tcp connections to socketio without TLS termination. Browsers do not support raw TCP sockets, hence this library allows you to attach a proxy, which accepts any incoming `socket.io` connection and opens a corresponding tcp socket. To be used in conjunction with [emailjs-tcp-socket](https://github.com/emailjs/emailjs-tcp-socket#web-sockets)

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
