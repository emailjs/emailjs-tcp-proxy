'use strict';

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _config = require('config');

var _proxy = require('./proxy');

var _proxy2 = _interopRequireDefault(_proxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-unused-expressions */

describe('WebSocket Shim', function () {
  var buffer = Uint8Array.from([1, 2, 3]).buffer;
  var echoPort = _config.server.port + 10;
  var echoServer = void 0;
  var proxy = void 0;

  before(function () {
    return (0, _proxy2.default)().then(function (pxy) {
      proxy = pxy;
    });
  });

  beforeEach(function (done) {
    echoServer = _net2.default.createServer(function (socket) {
      return socket.pipe(socket);
    });
    echoServer.listen(echoPort, done);
  });

  afterEach(function (done) {
    echoServer.close(done);
  });

  after(function (done) {
    proxy.close(done);
  });

  it('should send and receive data from echo server', function (done) {
    var webSocket = (0, _socket2.default)('http://' + _config.server.host + ':' + _config.server.port + '/');
    webSocket.on('data', function (data) {
      expect(nodeBuffertoArrayBuffer(data)).to.deep.equal(buffer);
      webSocket.disconnect();
    });
    webSocket.on('disconnect', function () {
      done();
    });
    webSocket.emit('open', { host: _config.server.host, port: echoPort }, function (hostname) {
      expect(hostname).to.exist;
      webSocket.emit('data', buffer);
    });
  });
});

var nodeBuffertoArrayBuffer = function nodeBuffertoArrayBuffer(buf) {
  return Uint8Array.from(buf).buffer;
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wcm94eS1pbnRlZ3JhdGlvbi5qcyJdLCJuYW1lcyI6WyJkZXNjcmliZSIsImJ1ZmZlciIsIlVpbnQ4QXJyYXkiLCJmcm9tIiwiZWNob1BvcnQiLCJwb3J0IiwiZWNob1NlcnZlciIsInByb3h5IiwiYmVmb3JlIiwidGhlbiIsInB4eSIsImJlZm9yZUVhY2giLCJkb25lIiwiY3JlYXRlU2VydmVyIiwic29ja2V0IiwicGlwZSIsImxpc3RlbiIsImFmdGVyRWFjaCIsImNsb3NlIiwiYWZ0ZXIiLCJpdCIsIndlYlNvY2tldCIsImhvc3QiLCJvbiIsImV4cGVjdCIsIm5vZGVCdWZmZXJ0b0FycmF5QnVmZmVyIiwiZGF0YSIsInRvIiwiZGVlcCIsImVxdWFsIiwiZGlzY29ubmVjdCIsImVtaXQiLCJob3N0bmFtZSIsImV4aXN0IiwiYnVmIl0sIm1hcHBpbmdzIjoiOztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7Ozs7O0FBTEE7O0FBT0FBLFNBQVMsZ0JBQVQsRUFBMkIsWUFBTTtBQUMvQixNQUFNQyxTQUFTQyxXQUFXQyxJQUFYLENBQWdCLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLENBQWhCLEVBQTJCRixNQUExQztBQUNBLE1BQU1HLFdBQVcsZUFBT0MsSUFBUCxHQUFjLEVBQS9CO0FBQ0EsTUFBSUMsbUJBQUo7QUFDQSxNQUFJQyxjQUFKOztBQUVBQyxTQUFPO0FBQUEsV0FBTSx1QkFDVkMsSUFEVSxDQUNMLGVBQU87QUFBRUYsY0FBUUcsR0FBUjtBQUFhLEtBRGpCLENBQU47QUFBQSxHQUFQOztBQUdBQyxhQUFXLFVBQUNDLElBQUQsRUFBVTtBQUNuQk4saUJBQWEsY0FBSU8sWUFBSixDQUFpQjtBQUFBLGFBQVVDLE9BQU9DLElBQVAsQ0FBWUQsTUFBWixDQUFWO0FBQUEsS0FBakIsQ0FBYjtBQUNBUixlQUFXVSxNQUFYLENBQWtCWixRQUFsQixFQUE0QlEsSUFBNUI7QUFDRCxHQUhEOztBQUtBSyxZQUFVLFVBQUNMLElBQUQsRUFBVTtBQUNsQk4sZUFBV1ksS0FBWCxDQUFpQk4sSUFBakI7QUFDRCxHQUZEOztBQUlBTyxRQUFNLGdCQUFRO0FBQ1paLFVBQU1XLEtBQU4sQ0FBWU4sSUFBWjtBQUNELEdBRkQ7O0FBSUFRLEtBQUcsK0NBQUgsRUFBb0QsVUFBQ1IsSUFBRCxFQUFVO0FBQzVELFFBQU1TLFlBQVksa0NBQWEsZUFBT0MsSUFBcEIsU0FBNEIsZUFBT2pCLElBQW5DLE9BQWxCO0FBQ0FnQixjQUFVRSxFQUFWLENBQWEsTUFBYixFQUFxQixnQkFBUTtBQUMzQkMsYUFBT0Msd0JBQXdCQyxJQUF4QixDQUFQLEVBQXNDQyxFQUF0QyxDQUF5Q0MsSUFBekMsQ0FBOENDLEtBQTlDLENBQW9ENUIsTUFBcEQ7QUFDQW9CLGdCQUFVUyxVQUFWO0FBQ0QsS0FIRDtBQUlBVCxjQUFVRSxFQUFWLENBQWEsWUFBYixFQUEyQixZQUFNO0FBQy9CWDtBQUNELEtBRkQ7QUFHQVMsY0FBVVUsSUFBVixDQUFlLE1BQWYsRUFBdUIsRUFBRVQsTUFBTSxlQUFPQSxJQUFmLEVBQXFCakIsTUFBTUQsUUFBM0IsRUFBdkIsRUFBOEQsb0JBQVk7QUFDeEVvQixhQUFPUSxRQUFQLEVBQWlCTCxFQUFqQixDQUFvQk0sS0FBcEI7QUFDQVosZ0JBQVVVLElBQVYsQ0FBZSxNQUFmLEVBQXVCOUIsTUFBdkI7QUFDRCxLQUhEO0FBSUQsR0FiRDtBQWNELENBcENEOztBQXNDQSxJQUFNd0IsMEJBQTBCLFNBQTFCQSx1QkFBMEI7QUFBQSxTQUFPdkIsV0FBV0MsSUFBWCxDQUFnQitCLEdBQWhCLEVBQXFCakMsTUFBNUI7QUFBQSxDQUFoQyIsImZpbGUiOiJwcm94eS1pbnRlZ3JhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC1leHByZXNzaW9ucyAqL1xuXG5pbXBvcnQgaW8gZnJvbSAnc29ja2V0LmlvLWNsaWVudCdcbmltcG9ydCBuZXQgZnJvbSAnbmV0J1xuaW1wb3J0IHsgc2VydmVyIH0gZnJvbSAnY29uZmlnJ1xuaW1wb3J0IHN0YXJ0UHJveHkgZnJvbSAnLi9wcm94eSdcblxuZGVzY3JpYmUoJ1dlYlNvY2tldCBTaGltJywgKCkgPT4ge1xuICBjb25zdCBidWZmZXIgPSBVaW50OEFycmF5LmZyb20oWzEsIDIsIDNdKS5idWZmZXJcbiAgY29uc3QgZWNob1BvcnQgPSBzZXJ2ZXIucG9ydCArIDEwXG4gIGxldCBlY2hvU2VydmVyXG4gIGxldCBwcm94eVxuXG4gIGJlZm9yZSgoKSA9PiBzdGFydFByb3h5KClcbiAgICAudGhlbihweHkgPT4geyBwcm94eSA9IHB4eSB9KSlcblxuICBiZWZvcmVFYWNoKChkb25lKSA9PiB7XG4gICAgZWNob1NlcnZlciA9IG5ldC5jcmVhdGVTZXJ2ZXIoc29ja2V0ID0+IHNvY2tldC5waXBlKHNvY2tldCkpXG4gICAgZWNob1NlcnZlci5saXN0ZW4oZWNob1BvcnQsIGRvbmUpXG4gIH0pXG5cbiAgYWZ0ZXJFYWNoKChkb25lKSA9PiB7XG4gICAgZWNob1NlcnZlci5jbG9zZShkb25lKVxuICB9KVxuXG4gIGFmdGVyKGRvbmUgPT4ge1xuICAgIHByb3h5LmNsb3NlKGRvbmUpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBzZW5kIGFuZCByZWNlaXZlIGRhdGEgZnJvbSBlY2hvIHNlcnZlcicsIChkb25lKSA9PiB7XG4gICAgY29uc3Qgd2ViU29ja2V0ID0gaW8oYGh0dHA6Ly8ke3NlcnZlci5ob3N0fToke3NlcnZlci5wb3J0fS9gKVxuICAgIHdlYlNvY2tldC5vbignZGF0YScsIGRhdGEgPT4ge1xuICAgICAgZXhwZWN0KG5vZGVCdWZmZXJ0b0FycmF5QnVmZmVyKGRhdGEpKS50by5kZWVwLmVxdWFsKGJ1ZmZlcilcbiAgICAgIHdlYlNvY2tldC5kaXNjb25uZWN0KClcbiAgICB9KVxuICAgIHdlYlNvY2tldC5vbignZGlzY29ubmVjdCcsICgpID0+IHtcbiAgICAgIGRvbmUoKVxuICAgIH0pXG4gICAgd2ViU29ja2V0LmVtaXQoJ29wZW4nLCB7IGhvc3Q6IHNlcnZlci5ob3N0LCBwb3J0OiBlY2hvUG9ydCB9LCBob3N0bmFtZSA9PiB7XG4gICAgICBleHBlY3QoaG9zdG5hbWUpLnRvLmV4aXN0XG4gICAgICB3ZWJTb2NrZXQuZW1pdCgnZGF0YScsIGJ1ZmZlcilcbiAgICB9KVxuICB9KVxufSlcblxuY29uc3Qgbm9kZUJ1ZmZlcnRvQXJyYXlCdWZmZXIgPSBidWYgPT4gVWludDhBcnJheS5mcm9tKGJ1ZikuYnVmZmVyXG4iXX0=