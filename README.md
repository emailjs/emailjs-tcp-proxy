# emailjs-tcp-proxy

Tunnels tcp connections to socketio without TLS termination

## Usage as library to use in your own services

```javascript
import startProxy from 'emailjs-tcp-proxy'

const port = 12345
startProxy(port)
  .then(proxy => {
    ...
    proxy.close()
  })
```

## Usage as standalone

```bash
git clone git@github.com:emailjs/emailjs-tcp-proxy.git
cd emailjs-tcp-proxy
PROXY_PORT=1234 npm start
```
