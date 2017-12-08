# emailjs-tcp-proxy

Tunnels tcp connections to socketio without TLS termination

## Usage as library to use in your own services

```javascript
import startProxy from 'emailjs-tcp-proxy'

startProxy()
  .then(proxy => {
    ...
    proxy.close()
  })
```

## Usage as standalone

```bash
git clone git@github.com:emailjs/emailjs-tcp-proxy.git
cd emailjs-tcp-proxy
NODE_ENV=production npm start
```
