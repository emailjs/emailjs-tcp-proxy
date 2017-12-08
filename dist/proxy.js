'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _npmlog = require('npmlog');

var _npmlog2 = _interopRequireDefault(_npmlog);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_npmlog2.default.level = _config2.default.log.level;

exports.default = function () {
  return new Promise(function (resolve) {
    var app = (0, _express2.default)();
    var server = (0, _http.Server)(app);
    var io = (0, _socket2.default)(server);

    app.disable('x-powered-by');
    app.use((0, _morgan2.default)(_config2.default.log.http, {
      stream: { write: function write() {
          var line = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
          return line.trim() && _npmlog2.default.http('express', line);
        } }
    }));

    server.listen(_config2.default.server.port, _config2.default.server.host, function () {
      io.on('connection', onSocketIncoming);

      var _server$address = server.address(),
          address = _server$address.address,
          port = _server$address.port;

      _npmlog2.default.info('express', 'Server listening on %s:%s', address, port);
      resolve(server);
    });
  });
};

var onSocketIncoming = function onSocketIncoming(socket) {
  _npmlog2.default.info('io', 'New connection [%s] from %s', socket.conn.id, socket.conn.remoteAddress);

  socket.on('open', function (data, fn) {
    _npmlog2.default.verbose('io', 'Open request to %s:%s [%s]', data.host, data.port, socket.conn.id);
    var tcp = _net2.default.connect(data.port, data.host, function () {
      _npmlog2.default.verbose('io', 'Opened tcp connection to %s:%s [%s]', data.host, data.port, socket.conn.id);

      tcp.on('data', function (chunk) {
        _npmlog2.default.silly('io', 'Received %s bytes from %s:%s [%s]', chunk.length, data.host, data.port, socket.conn.id);
        socket.emit('data', chunk);
      });

      tcp.on('error', function (err) {
        _npmlog2.default.verbose('io', 'Error for %s:%s [%s]: %s', data.host, data.port, socket.conn.id, err.message);
        socket.emit('error', err.message);
      });

      tcp.on('end', function () {
        return socket.emit('end');
      });

      tcp.on('close', function () {
        _npmlog2.default.verbose('io', 'Closed tcp connection to %s:%s [%s]', data.host, data.port, socket.conn.id);
        socket.emit('close');

        socket.removeAllListeners('data');
        socket.removeAllListeners('end');
      });

      socket.on('data', function (chunk, fn) {
        if (!chunk || !chunk.length) {
          if (typeof fn === 'function') {
            fn();
          }
          return;
        }
        _npmlog2.default.silly('io', 'Sending %s bytes to %s:%s [%s]', chunk.length, data.host, data.port, socket.conn.id);
        tcp.write(chunk, function () {
          if (typeof fn === 'function') {
            fn();
          }
        });
      });

      socket.on('end', function () {
        _npmlog2.default.verbose('io', 'Received request to close connection to %s:%s [%s]', data.host, data.port, socket.conn.id);
        tcp.end();
      });

      if (typeof fn === 'function') {
        fn(_os2.default.hostname()); // reply with hostname once we're set up
      }

      socket.on('disconnect', function () {
        _npmlog2.default.verbose('io', 'Closed connection [%s], closing connection to %s:%s ', socket.conn.id, data.host, data.port);
        tcp.end();
        socket.removeAllListeners();
      });
    });
  });
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wcm94eS5qcyJdLCJuYW1lcyI6WyJsZXZlbCIsImxvZyIsIlByb21pc2UiLCJyZXNvbHZlIiwiYXBwIiwic2VydmVyIiwiaW8iLCJkaXNhYmxlIiwidXNlIiwiaHR0cCIsInN0cmVhbSIsIndyaXRlIiwibGluZSIsInRyaW0iLCJsaXN0ZW4iLCJwb3J0IiwiaG9zdCIsIm9uIiwib25Tb2NrZXRJbmNvbWluZyIsImFkZHJlc3MiLCJpbmZvIiwic29ja2V0IiwiY29ubiIsImlkIiwicmVtb3RlQWRkcmVzcyIsImRhdGEiLCJmbiIsInZlcmJvc2UiLCJ0Y3AiLCJjb25uZWN0Iiwic2lsbHkiLCJjaHVuayIsImxlbmd0aCIsImVtaXQiLCJlcnIiLCJtZXNzYWdlIiwicmVtb3ZlQWxsTGlzdGVuZXJzIiwiZW5kIiwiaG9zdG5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxpQkFBSUEsS0FBSixHQUFZLGlCQUFPQyxHQUFQLENBQVdELEtBQXZCOztrQkFFZTtBQUFBLFNBQU0sSUFBSUUsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBYTtBQUM1QyxRQUFNQyxNQUFNLHdCQUFaO0FBQ0EsUUFBTUMsU0FBUyxrQkFBT0QsR0FBUCxDQUFmO0FBQ0EsUUFBTUUsS0FBSyxzQkFBU0QsTUFBVCxDQUFYOztBQUVBRCxRQUFJRyxPQUFKLENBQVksY0FBWjtBQUNBSCxRQUFJSSxHQUFKLENBQVEsc0JBQU8saUJBQU9QLEdBQVAsQ0FBV1EsSUFBbEIsRUFBd0I7QUFDOUJDLGNBQVEsRUFBRUMsT0FBTztBQUFBLGNBQUNDLElBQUQsdUVBQVEsRUFBUjtBQUFBLGlCQUFlQSxLQUFLQyxJQUFMLE1BQWUsaUJBQUlKLElBQUosQ0FBUyxTQUFULEVBQW9CRyxJQUFwQixDQUE5QjtBQUFBLFNBQVQ7QUFEc0IsS0FBeEIsQ0FBUjs7QUFJQVAsV0FBT1MsTUFB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RUFBa0RDLE1BQU1DLE1BQXhELEVBQWdFUCxLQUFLVCxJQUFyRSxFQUEyRVMsS0FBS1YsSUFBaEYsRUFBc0ZNLE9BQU9DLElBQVAsQ0FBWUMsRUFBbEc7QUFDQUssWUFBSWpCLEtBQUosQ0FBVW9CLEtBQVYsRUFBaUIsWUFBTTtBQUNyQixjQUFJLE9BQU9MLEVBQVAsS0FBYyxVQUFsQixFQUE4QjtBQUM1QkE7QUFDRDtBQUNGLFNBSkQ7QUFLRCxPQWJEOztBQWVBTCxhQUFPSixFQUFQLENBQVUsS0FBVixFQUFpQixZQUFNO0FBQ3JCLHlCQUFJVSxPQUFKLENBQVksSUFBWixFQUFrQixvREFBbEIsRUFBd0VGLEtBQUtULElBQTdFLEVBQW1GUyxLQUFLVixJQUF4RixFQUE4Rk0sT0FBT0MsSUFBUCxDQUFZQyxFQUExRztBQUNBSyxZQUFJUyxHQUFKO0FBQ0QsT0FIRDs7QUFLQSxVQUFJLE9BQU9YLEVBQVAsS0FBYyxVQUFsQixFQUE4QjtBQUM1QkEsV0FBRyxhQUFHWSxRQUFILEVBQUgsRUFENEIsQ0FDVjtBQUNuQjs7QUFFRGpCLGFBQU9KLEVBQVAsQ0FBVSxZQUFWLEVBQXdCLFlBQVk7QUFDbEMseUJBQUlVLE9BQUosQ0FBWSxJQUFaLEVBQWtCLHNEQUFsQixFQUEwRU4sT0FBT0MsSUFBUCxDQUFZQyxFQUF0RixFQUEwRkUsS0FBS1QsSUFBL0YsRUFBcUdTLEtBQUtWLElBQTFHO0FBQ0FhLFlBQUlTLEdBQUo7QUFDQWhCLGVBQU9lLGtCQUFQO0FBQ0QsT0FKRDtBQUtELEtBcERXLENBQVo7QUFxREQsR0F2REQ7QUF3REQsQ0EzREQiLCJmaWxlIjoicHJveHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbG9nIGZyb20gJ25wbWxvZydcbmltcG9ydCBjb25maWcgZnJvbSAnY29uZmlnJ1xuaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcydcbmltcG9ydCB7IFNlcnZlciB9IGZyb20gJ2h0dHAnXG5pbXBvcnQgc29ja2V0aW8gZnJvbSAnc29ja2V0LmlvJ1xuaW1wb3J0IG5ldCBmcm9tICduZXQnXG5pbXBvcnQgb3MgZnJvbSAnb3MnXG5pbXBvcnQgbW9yZ2FuIGZyb20gJ21vcmdhbidcblxubG9nLmxldmVsID0gY29uZmlnLmxvZy5sZXZlbFxuXG5leHBvcnQgZGVmYXVsdCAoKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICBjb25zdCBhcHAgPSBleHByZXNzKClcbiAgY29uc3Qgc2VydmVyID0gU2VydmVyKGFwcClcbiAgY29uc3QgaW8gPSBzb2NrZXRpbyhzZXJ2ZXIpXG5cbiAgYXBwLmRpc2FibGUoJ3gtcG93ZXJlZC1ieScpXG4gIGFwcC51c2UobW9yZ2FuKGNvbmZpZy5sb2cuaHR0cCwge1xuICAgIHN0cmVhbTogeyB3cml0ZTogKGxpbmUgPSAnJykgPT4gbGluZS50cmltKCkgJiYgbG9nLmh0dHAoJ2V4cHJlc3MnLCBsaW5lKSB9XG4gIH0pKVxuXG4gIHNlcnZlci5saXN0ZW4oY29uZmlnLnNlcnZlci5wb3J0LCBjb25maWcuc2VydmVyLmhvc3QsIGZ1bmN0aW9uICgpIHtcbiAgICBpby5vbignY29ubmVjdGlvbicsIG9uU29ja2V0SW5jb21pbmcpXG4gICAgY29uc3Qge2FkZHJlc3MsIHBvcnR9ID0gc2VydmVyLmFkZHJlc3MoKVxuICAgIGxvZy5pbmZvKCdleHByZXNzJywgJ1NlcnZlciBsaXN0ZW5pbmcgb24gJXM6JXMnLCBhZGRyZXNzLCBwb3J0KVxuICAgIHJlc29sdmUoc2VydmVyKVxuICB9KVxufSlcblxuY29uc3Qgb25Tb2NrZXRJbmNvbWluZyA9IHNvY2tldCA9PiB7XG4gIGxvZy5pbmZvKCdpbycsICdOZXcgY29ubmVjdGlvbiBbJXNdIGZyb20gJXMnLCBzb2NrZXQuY29ubi5pZCwgc29ja2V0LmNvbm4ucmVtb3RlQWRkcmVzcylcblxuICBzb2NrZXQub24oJ29wZW4nLCAoZGF0YSwgZm4pID0+IHtcbiAgICBsb2cudmVyYm9zZSgnaW8nLCAnT3BlbiByZXF1ZXN0IHRvICVzOiVzIFslc10nLCBkYXRhLmhvc3QsIGRhdGEucG9ydCwgc29ja2V0LmNvbm4uaWQpXG4gICAgY29uc3QgdGNwID0gbmV0LmNvbm5lY3QoZGF0YS5wb3J0LCBkYXRhLmhvc3QsICgpID0+IHtcbiAgICAgIGxvZy52ZXJib3NlKCdpbycsICdPcGVuZWQgdGNwIGNvbm5lY3Rpb24gdG8gJXM6JXMgWyVzXScsIGRhdGEuaG9zdCwgZGF0YS5wb3J0LCBzb2NrZXQuY29ubi5pZClcblxuICAgICAgdGNwLm9uKCdkYXRhJywgY2h1bmsgPT4ge1xuICAgICAgICBsb2cuc2lsbHkoJ2lvJywgJ1JlY2VpdmVkICVzIGJ5dGVzIGZyb20gJXM6JXMgWyVzXScsIGNodW5rLmxlbmd0aCwgZGF0YS5ob3N0LCBkYXRhLnBvcnQsIHNvY2tldC5jb25uLmlkKVxuICAgICAgICBzb2NrZXQuZW1pdCgnZGF0YScsIGNodW5rKVxuICAgICAgfSlcblxuICAgICAgdGNwLm9uKCdlcnJvcicsIGVyciA9PiB7XG4gICAgICAgIGxvZy52ZXJib3NlKCdpbycsICdFcnJvciBmb3IgJXM6JXMgWyVzXTogJXMnLCBkYXRhLmhvc3QsIGRhdGEucG9ydCwgc29ja2V0LmNvbm4uaWQsIGVyci5tZXNzYWdlKVxuICAgICAgICBzb2NrZXQuZW1pdCgnZXJyb3InLCBlcnIubWVzc2FnZSlcbiAgICAgIH0pXG5cbiAgICAgIHRjcC5vbignZW5kJywgKCkgPT4gc29ja2V0LmVtaXQoJ2VuZCcpKVxuXG4gICAgICB0Y3Aub24oJ2Nsb3NlJywgKCkgPT4ge1xuICAgICAgICBsb2cudmVyYm9zZSgnaW8nLCAnQ2xvc2VkIHRjcCBjb25uZWN0aW9uIHRvICVzOiVzIFslc10nLCBkYXRhLmhvc3QsIGRhdGEucG9ydCwgc29ja2V0LmNvbm4uaWQpXG4gICAgICAgIHNvY2tldC5lbWl0KCdjbG9zZScpXG5cbiAgICAgICAgc29ja2V0LnJlbW92ZUFsbExpc3RlbmVycygnZGF0YScpXG4gICAgICAgIHNvY2tldC5yZW1vdmVBbGxMaXN0ZW5lcnMoJ2VuZCcpXG4gICAgICB9KVxuXG4gICAgICBzb2NrZXQub24oJ2RhdGEnLCAoY2h1bmssIGZuKSA9PiB7XG4gICAgICAgIGlmICghY2h1bmsgfHwgIWNodW5rLmxlbmd0aCkge1xuICAgICAgICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGZuKClcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgbG9nLnNpbGx5KCdpbycsICdTZW5kaW5nICVzIGJ5dGVzIHRvICVzOiVzIFslc10nLCBjaHVuay5sZW5ndGgsIGRhdGEuaG9zdCwgZGF0YS5wb3J0LCBzb2NrZXQuY29ubi5pZClcbiAgICAgICAgdGNwLndyaXRlKGNodW5rLCAoKSA9PiB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgZm4oKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIHNvY2tldC5vbignZW5kJywgKCkgPT4ge1xuICAgICAgICBsb2cudmVyYm9zZSgnaW8nLCAnUmVjZWl2ZWQgcmVxdWVzdCB0byBjbG9zZSBjb25uZWN0aW9uIHRvICVzOiVzIFslc10nLCBkYXRhLmhvc3QsIGRhdGEucG9ydCwgc29ja2V0LmNvbm4uaWQpXG4gICAgICAgIHRjcC5lbmQoKVxuICAgICAgfSlcblxuICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBmbihvcy5ob3N0bmFtZSgpKSAvLyByZXBseSB3aXRoIGhvc3RuYW1lIG9uY2Ugd2UncmUgc2V0IHVwXG4gICAgICB9XG5cbiAgICAgIHNvY2tldC5vbignZGlzY29ubmVjdCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbG9nLnZlcmJvc2UoJ2lvJywgJ0Nsb3NlZCBjb25uZWN0aW9uIFslc10sIGNsb3NpbmcgY29ubmVjdGlvbiB0byAlczolcyAnLCBzb2NrZXQuY29ubi5pZCwgZGF0YS5ob3N0LCBkYXRhLnBvcnQpXG4gICAgICAgIHRjcC5lbmQoKVxuICAgICAgICBzb2NrZXQucmVtb3ZlQWxsTGlzdGVuZXJzKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbn1cbiJdfQ==