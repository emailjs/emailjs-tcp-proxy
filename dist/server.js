'use strict';

var _cluster = require('cluster');

var _cluster2 = _interopRequireDefault(_cluster);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _npmlog = require('npmlog');

var _npmlog2 = _interopRequireDefault(_npmlog);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_npmlog2.default.level = _config2.default.log.level;

// Handle error conditions
process.on('SIGTERM', function () {
  _npmlog2.default.warn('exit', 'Exited on SIGTERM');
  process.exit(0);
});

process.on('SIGINT', function () {
  _npmlog2.default.warn('exit', 'Exited on SIGINT');
  process.exit(0);
});

process.on('uncaughtException', function (err) {
  _npmlog2.default.error('uncaughtException ', err);
  process.exit(1);
});

if (_cluster2.default.isMaster) {
  _cluster2.default.on('fork', function (worker) {
    _npmlog2.default.info('cluster', 'Forked worker #%s [pid:%s]', worker.id, worker.process.pid);
  });

  _cluster2.default.on('exit', function (worker) {
    _npmlog2.default.warn('cluster', 'Worker #%s [pid:%s] died', worker.id, worker.process.pid);
    setTimeout(function () {
      _cluster2.default.fork();
    }, 1000);
  });

  _cluster2.default.fork();
} else {
  var app = (0, _express2.default)();
  var server = (0, _http.Server)(app);
  var io = (0, _socket2.default)(server);

  // Setup logger. Stream all http logs to general logger
  app.use(require('morgan')(_config2.default.log.http, {
    'stream': {
      'write': function write() {
        var line = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        line.trim() && _npmlog2.default.http('express', line);
      }
    }
  }));

  // Do not advertise Express
  app.disable('x-powered-by');

  io.on('connection', function (socket) {
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

        // reply with hostname once we're set up
        if (typeof fn === 'function') {
          fn(_os2.default.hostname());
        }

        socket.on('disconnect', function () {
          _npmlog2.default.verbose('io', 'Closed connection [%s], closing connection to %s:%s ', socket.conn.id, data.host, data.port);
          tcp.end();
          socket.removeAllListeners();
        });
      });
    });
  });

  server.listen(_config2.default.server.port, _config2.default.server.host, function () {
    var address = server.address();
    _npmlog2.default.info('express', 'Server listening on %s:%s', address.address, address.port);
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zZXJ2ZXIuanMiXSwibmFtZXMiOlsibGV2ZWwiLCJsb2ciLCJwcm9jZXNzIiwib24iLCJ3YXJuIiwiZXhpdCIsImVyciIsImVycm9yIiwiaXNNYXN0ZXIiLCJ3b3JrZXIiLCJpbmZvIiwiaWQiLCJwaWQiLCJzZXRUaW1lb3V0IiwiZm9yayIsImFwcCIsInNlcnZlciIsImlvIiwidXNlIiwicmVxdWlyZSIsImh0dHAiLCJsaW5lIiwidHJpbSIsImRpc2FibGUiLCJzb2NrZXQiLCJjb25uIiwicmVtb3RlQWRkcmVzcyIsImRhdGEiLCJmbiIsInZlcmJvc2UiLCJob3N0IiwicG9ydCIsInRjcCIsImNvbm5lY3QiLCJzaWxseSIsImNodW5rIiwibGVuZ3RoIiwiZW1pdCIsIm1lc3NhZ2UiLCJyZW1vdmVBbGxMaXN0ZW5lcnMiLCJ3cml0ZSIsImVuZCIsImhvc3RuYW1lIiwibGlzdGVuIiwiYWRkcmVzcyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsaUJBQUlBLEtBQUosR0FBWSxpQkFBT0MsR0FBUCxDQUFXRCxLQUF2Qjs7QUFFQTtBQUNBRSxRQUFRQyxFQUFSLENBQVcsU0FBWCxFQUFzQixZQUFZO0FBQ2hDLG1CQUFJQyxJQUFKLENBQVMsTUFBVCxFQUFpQixtQkFBakI7QUFDQUYsVUFBUUcsSUFBUixDQUFhLENBQWI7QUFDRCxDQUhEOztBQUtBSCxRQUFRQyxFQUFSLENBQVcsUUFBWCxFQUFxQixZQUFZO0FBQy9CLG1CQUFJQyxJQUFKLENBQVMsTUFBVCxFQUFpQixrQkFBakI7QUFDQUYsVUFBUUcsSUFBUixDQUFhLENBQWI7QUFDRCxDQUhEOztBQUtBSCxRQUFRQyxFQUFSLENBQVcsbUJBQVgsRUFBZ0MsVUFBVUcsR0FBVixFQUFlO0FBQzdDLG1CQUFJQyxLQUFKLENBQVUsb0JBQVYsRUFBZ0NELEdBQWhDO0FBQ0FKLFVBQVFHLElBQVIsQ0FBYSxDQUFiO0FBQ0QsQ0FIRDs7QUFLQSxJQUFJLGtCQUFRRyxRQUFaLEVBQXNCO0FBQ3BCLG9CQUFRTCxFQUFSLENBQVcsTUFBWCxFQUFtQixVQUFVTSxNQUFWLEVBQWtCO0FBQ25DLHFCQUFJQyxJQUFKLENBQVMsU0FBVCxFQUFvQiw0QkFBcEIsRUFBa0RELE9BQU9FLEVBQXpELEVBQTZERixPQUFPUCxPQUFQLENBQWVVLEdBQTVFO0FBQ0QsR0FGRDs7QUFJQSxvQkFBUVQsRUFBUixDQUFXLE1BQVgsRUFBbUIsVUFBVU0sTUFBVixFQUFrQjtBQUNuQyxxQkFBSUwsSUFBSixDQUFTLFNBQVQsRUFBb0IsMEJBQXBCLEVBQWdESyxPQUFPRSxFQUF2RCxFQUEyREYsT0FBT1AsT0FBUCxDQUFlVSxHQUExRTtBQUNBQyxlQUFXLFlBQU07QUFBRSx3QkFBUUMsSUFBUjtBQUFnQixLQUFuQyxFQUFxQyxJQUFyQztBQUNELEdBSEQ7O0FBS0Esb0JBQVFBLElBQVI7QUFDRCxDQVhELE1BV087QUFDTCxNQUFNQyxNQUFNLHdCQUFaO0FBQ0EsTUFBTUMsU0FBUyxrQkFBT0QsR0FBUCxDQUFmO0FBQ0EsTUFBTUUsS0FBSyxzQkFBU0QsTUFBVCxDQUFYOztBQUVBO0FBQ0FELE1BQUlHLEdBQUosQ0FBUUMsUUFBUSxRQUFSLEVBQWtCLGlCQUFPbEIsR0FBUCxDQUFXbUIsSUFBN0IsRUFBbUM7QUFDekMsY0FBVTtBQUNSLGVBQVMsaUJBQXFCO0FBQUEsWUFBWEMsSUFBVyx1RUFBSixFQUFJOztBQUM1QkEsYUFBS0MsSUFBTCxNQUFlLGlCQUFJRixJQUFKLENBQVMsU0FBVCxFQUFvQkMsSUFBcEIsQ0FBZjtBQUNEO0FBSE87QUFEK0IsR0FBbkMsQ0FBUjs7QUFRQTtBQUNBTixNQUFJUSxPQUFKLENBQVksY0FBWjs7QUFFQU4sS0FBR2QsRUFBSCxDQUFNLFlBQU4sRUFBb0Isa0JBQVU7QUFDNUIscUJBQUlPLElBQUosQ0FBUyxJQUFULEVBQWUsNkJBQWYsRUFBOENjLE9BQU9DLElBQVAsQ0FBWWQsRUFBMUQsRUFBOERhLE9BQU9DLElBQVAsQ0FBWUMsYUFBMUU7O0FBRUFGLFdBQU9yQixFQUFQLENBQVUsTUFBVixFQUFrQixVQUFDd0IsSUFBRCxFQUFPQyxFQUFQLEVBQWM7QUFDOUIsdUJBQUlDLE9BQUosQ0FBWSxJQUFaLEVBQWtCLDRCQUFsQixFQUFnREYsS0FBS0csSUFBckQsRUFBMkRILEtBQUtJLElBQWhFLEVBQXNFUCxPQUFPQyxJQUFQLENBQVlkLEVBQWxGO0FBQ0EsVUFBTXFCLE1BQU0sY0FBSUMsT0FBSixDQUFZTixLQUFLSSxJQUFqQixFQUF1QkosS0FBS0csSUFBNUIsRUFBa0MsWUFBTTtBQUNsRCx5QkFBSUQsT0FBSixDQUFZLElBQVosRUFBa0IscUNBQWxCLEVBQXlERixLQUFLRyxJQUE5RCxFQUFvRUgsS0FBS0ksSUFBekUsRUFBK0VQLE9BQU9DLElBQVAsQ0FBWWQsRUFBM0Y7O0FBRUFxQixZQUFJN0IsRUFBSixDQUFPLE1BQVAsRUFBZSxpQkFBUztBQUN0QiwyQkFBSStCLEtBQUosQ0FBVSxJQUFWLEVBQWdCLG1DQUFoQixFQUFxREMsTUFBTUMsTUFBM0QsRUFBbUVULEtBQUtHLElBQXhFLEVBQThFSCxLQUFLSSxJQUFuRixFQUF5RlAsT0FBT0MsSUFBUCxDQUFZZCxFQUFyRztBQUNBYSxpQkFBT2EsSUFBUCxDQUFZLE1BQVosRUFBb0JGLEtBQXBCO0FBQ0QsU0FIRDs7QUFLQUgsWUFBSTdCLEVBQUosQ0FBTyxPQUFQLEVBQWdCLGVBQU87QUFDckIsMkJBQUkwQixPQUFKLENBQVksSUFBWixFQUFrQiwwQkFBbEIsRUFBOENGLEtBQUtHLElBQW5ELEVBQXlESCxLQUFLSSxJQUE5RCxFQUFvRVAsT0FBT0MsSUFBUCxDQUFZZCxFQUFoRixFQUFvRkwsSUFBSWdDLE9BQXhGO0FBQ0FkLGlCQUFPYSxJQUFQLENBQVksT0FBWixFQUFxQi9CLElBQUlnQyxPQUF6QjtBQUNELFNBSEQ7O0FBS0FOLFlBQUk3QixFQUFKLENBQU8sS0FBUCxFQUFjO0FBQUEsaUJBQU1xQixPQUFPYSxJQUFQLENBQVksS0FBWixDQUFOO0FBQUEsU0FBZDs7QUFFQUwsWUFBSTdCLEVBQUosQ0FBTyxPQUFQLEVBQWdCLFlBQU07QUFDcEIsMkJBQUkwQixPQUFKLENBQVksSUFBWixFQUFrQixxQ0FBbEIsRUFBeURGLEtBQUtHLElBQTlELEVBQW9FSCxLQUFLSSxJQUF6RSxFQUErRVAsT0FBT0MsSUFBUCxDQUFZZCxFQUEzRjtBQUNBYSxpQkFBT2EsSUFBUCxDQUFZLE9BQVo7O0FBRUFiLGlCQUFPZSxrQkFBUCxDQUEwQixNQUExQjtBQUNBZixpQkFBT2Usa0JBQVAsQ0FBMEIsS0FBMUI7QUFDRCxTQU5EOztBQVFBZixlQUFPckIsRUFBUCxDQUFVLE1BQVYsRUFBa0IsVUFBQ2dDLEtBQUQsRUFBUVAsRUFBUixFQUFlO0FBQy9CLGNBQUksQ0FBQ08sS0FBRCxJQUFVLENBQUNBLE1BQU1DLE1BQXJCLEVBQTZCO0FBQzNCLGdCQUFJLE9BQU9SLEVBQVAsS0FBYyxVQUFsQixFQUE4QjtBQUM1QkE7QUFDRDtBQUNEO0FBQ0Q7QUFDRCwyQkFBSU0sS0FBSixDQUFVLElBQVYsRUFBZ0IsZ0NBQWhCLEVBQWtEQyxNQUFNQyxNQUF4RCxFQUFnRVQsS0FBS0csSUFBckUsRUFBMkVILEtBQUtJLElBQWhGLEVBQXNGUCxPQUFPQyxJQUFQLENBQVlkLEVBQWxHO0FBQ0FxQixjQUFJUSxLQUFKLENBQVVMLEtBQVYsRUFBaUIsWUFBTTtBQUNyQixnQkFBSSxPQUFPUCxFQUFQLEtBQWMsVUFBbEIsRUFBOEI7QUFDNUJBO0FBQ0Q7QUFDRixXQUpEO0FBS0QsU0FiRDs7QUFlQUosZUFBT3JCLEVBQVAsQ0FBVSxLQUFWLEVBQWlCLFlBQU07QUFDckIsMkJBQUkwQixPQUFKLENBQVksSUFBWixFQUFrQixvREFBbEIsRUFBd0VGLEtBQUtHLElBQTdFLEVBQW1GSCxLQUFLSSxJQUF4RixFQUE4RlAsT0FBT0MsSUFBUCxDQUFZZCxFQUExRztBQUNBcUIsY0FBSVMsR0FBSjtBQUNELFNBSEQ7O0FBS0E7QUFDQSxZQUFJLE9BQU9iLEVBQVAsS0FBYyxVQUFsQixFQUE4QjtBQUM1QkEsYUFBRyxhQUFHYyxRQUFILEVBQUg7QUFDRDs7QUFFRGxCLGVBQU9yQixFQUFQLENBQVUsWUFBVixFQUF3QixZQUFZO0FBQ2xDLDJCQUFJMEIsT0FBSixDQUFZLElBQVosRUFBa0Isc0RBQWxCLEVBQTBFTCxPQUFPQyxJQUFQLENBQVlkLEVBQXRGLEVBQTBGZ0IsS0FBS0csSUFBL0YsRUFBcUdILEtBQUtJLElBQTFHO0FBQ0FDLGNBQUlTLEdBQUo7QUFDQWpCLGlCQUFPZSxrQkFBUDtBQUNELFNBSkQ7QUFLRCxPQXJEVyxDQUFaO0FBc0RELEtBeEREO0FBeURELEdBNUREOztBQThEQXZCLFNBQU8yQixNQUFQLENBQWMsaUJBQU8zQixNQUFQLENBQWNlLElBQTVCLEVBQWtDLGlCQUFPZixNQUFQLENBQWNjLElBQWhELEVBQXNELFlBQVk7QUFDaEUsUUFBSWMsVUFBVTVCLE9BQU80QixPQUFQLEVBQWQ7QUFDQSxxQkFBSWxDLElBQUosQ0FBUyxTQUFULEVBQW9CLDJCQUFwQixFQUFpRGtDLFFBQVFBLE9BQXpELEVBQWtFQSxRQUFRYixJQUExRTtBQUNELEdBSEQ7QUFJRCIsImZpbGUiOiJzZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2x1c3RlciBmcm9tICdjbHVzdGVyJ1xuaW1wb3J0IGNvbmZpZyBmcm9tICdjb25maWcnXG5pbXBvcnQgbG9nIGZyb20gJ25wbWxvZydcbmltcG9ydCBvcyBmcm9tICdvcydcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnXG5pbXBvcnQgeyBTZXJ2ZXIgfSBmcm9tICdodHRwJ1xuaW1wb3J0IHNvY2tldGlvIGZyb20gJ3NvY2tldC5pbydcbmltcG9ydCBuZXQgZnJvbSAnbmV0J1xuXG5sb2cubGV2ZWwgPSBjb25maWcubG9nLmxldmVsXG5cbi8vIEhhbmRsZSBlcnJvciBjb25kaXRpb25zXG5wcm9jZXNzLm9uKCdTSUdURVJNJywgZnVuY3Rpb24gKCkge1xuICBsb2cud2FybignZXhpdCcsICdFeGl0ZWQgb24gU0lHVEVSTScpXG4gIHByb2Nlc3MuZXhpdCgwKVxufSlcblxucHJvY2Vzcy5vbignU0lHSU5UJywgZnVuY3Rpb24gKCkge1xuICBsb2cud2FybignZXhpdCcsICdFeGl0ZWQgb24gU0lHSU5UJylcbiAgcHJvY2Vzcy5leGl0KDApXG59KVxuXG5wcm9jZXNzLm9uKCd1bmNhdWdodEV4Y2VwdGlvbicsIGZ1bmN0aW9uIChlcnIpIHtcbiAgbG9nLmVycm9yKCd1bmNhdWdodEV4Y2VwdGlvbiAnLCBlcnIpXG4gIHByb2Nlc3MuZXhpdCgxKVxufSlcblxuaWYgKGNsdXN0ZXIuaXNNYXN0ZXIpIHtcbiAgY2x1c3Rlci5vbignZm9yaycsIGZ1bmN0aW9uICh3b3JrZXIpIHtcbiAgICBsb2cuaW5mbygnY2x1c3RlcicsICdGb3JrZWQgd29ya2VyICMlcyBbcGlkOiVzXScsIHdvcmtlci5pZCwgd29ya2VyLnByb2Nlc3MucGlkKVxuICB9KVxuXG4gIGNsdXN0ZXIub24oJ2V4aXQnLCBmdW5jdGlvbiAod29ya2VyKSB7XG4gICAgbG9nLndhcm4oJ2NsdXN0ZXInLCAnV29ya2VyICMlcyBbcGlkOiVzXSBkaWVkJywgd29ya2VyLmlkLCB3b3JrZXIucHJvY2Vzcy5waWQpXG4gICAgc2V0VGltZW91dCgoKSA9PiB7IGNsdXN0ZXIuZm9yaygpIH0sIDEwMDApXG4gIH0pXG5cbiAgY2x1c3Rlci5mb3JrKClcbn0gZWxzZSB7XG4gIGNvbnN0IGFwcCA9IGV4cHJlc3MoKVxuICBjb25zdCBzZXJ2ZXIgPSBTZXJ2ZXIoYXBwKVxuICBjb25zdCBpbyA9IHNvY2tldGlvKHNlcnZlcilcblxuICAvLyBTZXR1cCBsb2dnZXIuIFN0cmVhbSBhbGwgaHR0cCBsb2dzIHRvIGdlbmVyYWwgbG9nZ2VyXG4gIGFwcC51c2UocmVxdWlyZSgnbW9yZ2FuJykoY29uZmlnLmxvZy5odHRwLCB7XG4gICAgJ3N0cmVhbSc6IHtcbiAgICAgICd3cml0ZSc6IGZ1bmN0aW9uIChsaW5lID0gJycpIHtcbiAgICAgICAgbGluZS50cmltKCkgJiYgbG9nLmh0dHAoJ2V4cHJlc3MnLCBsaW5lKVxuICAgICAgfVxuICAgIH1cbiAgfSkpXG5cbiAgLy8gRG8gbm90IGFkdmVydGlzZSBFeHByZXNzXG4gIGFwcC5kaXNhYmxlKCd4LXBvd2VyZWQtYnknKVxuXG4gIGlvLm9uKCdjb25uZWN0aW9uJywgc29ja2V0ID0+IHtcbiAgICBsb2cuaW5mbygnaW8nLCAnTmV3IGNvbm5lY3Rpb24gWyVzXSBmcm9tICVzJywgc29ja2V0LmNvbm4uaWQsIHNvY2tldC5jb25uLnJlbW90ZUFkZHJlc3MpXG5cbiAgICBzb2NrZXQub24oJ29wZW4nLCAoZGF0YSwgZm4pID0+IHtcbiAgICAgIGxvZy52ZXJib3NlKCdpbycsICdPcGVuIHJlcXVlc3QgdG8gJXM6JXMgWyVzXScsIGRhdGEuaG9zdCwgZGF0YS5wb3J0LCBzb2NrZXQuY29ubi5pZClcbiAgICAgIGNvbnN0IHRjcCA9IG5ldC5jb25uZWN0KGRhdGEucG9ydCwgZGF0YS5ob3N0LCAoKSA9PiB7XG4gICAgICAgIGxvZy52ZXJib3NlKCdpbycsICdPcGVuZWQgdGNwIGNvbm5lY3Rpb24gdG8gJXM6JXMgWyVzXScsIGRhdGEuaG9zdCwgZGF0YS5wb3J0LCBzb2NrZXQuY29ubi5pZClcblxuICAgICAgICB0Y3Aub24oJ2RhdGEnLCBjaHVuayA9PiB7XG4gICAgICAgICAgbG9nLnNpbGx5KCdpbycsICdSZWNlaXZlZCAlcyBieXRlcyBmcm9tICVzOiVzIFslc10nLCBjaHVuay5sZW5ndGgsIGRhdGEuaG9zdCwgZGF0YS5wb3J0LCBzb2NrZXQuY29ubi5pZClcbiAgICAgICAgICBzb2NrZXQuZW1pdCgnZGF0YScsIGNodW5rKVxuICAgICAgICB9KVxuXG4gICAgICAgIHRjcC5vbignZXJyb3InLCBlcnIgPT4ge1xuICAgICAgICAgIGxvZy52ZXJib3NlKCdpbycsICdFcnJvciBmb3IgJXM6JXMgWyVzXTogJXMnLCBkYXRhLmhvc3QsIGRhdGEucG9ydCwgc29ja2V0LmNvbm4uaWQsIGVyci5tZXNzYWdlKVxuICAgICAgICAgIHNvY2tldC5lbWl0KCdlcnJvcicsIGVyci5tZXNzYWdlKVxuICAgICAgICB9KVxuXG4gICAgICAgIHRjcC5vbignZW5kJywgKCkgPT4gc29ja2V0LmVtaXQoJ2VuZCcpKVxuXG4gICAgICAgIHRjcC5vbignY2xvc2UnLCAoKSA9PiB7XG4gICAgICAgICAgbG9nLnZlcmJvc2UoJ2lvJywgJ0Nsb3NlZCB0Y3AgY29ubmVjdGlvbiB0byAlczolcyBbJXNdJywgZGF0YS5ob3N0LCBkYXRhLnBvcnQsIHNvY2tldC5jb25uLmlkKVxuICAgICAgICAgIHNvY2tldC5lbWl0KCdjbG9zZScpXG5cbiAgICAgICAgICBzb2NrZXQucmVtb3ZlQWxsTGlzdGVuZXJzKCdkYXRhJylcbiAgICAgICAgICBzb2NrZXQucmVtb3ZlQWxsTGlzdGVuZXJzKCdlbmQnKVxuICAgICAgICB9KVxuXG4gICAgICAgIHNvY2tldC5vbignZGF0YScsIChjaHVuaywgZm4pID0+IHtcbiAgICAgICAgICBpZiAoIWNodW5rIHx8ICFjaHVuay5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgZm4oKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuICAgICAgICAgIGxvZy5zaWxseSgnaW8nLCAnU2VuZGluZyAlcyBieXRlcyB0byAlczolcyBbJXNdJywgY2h1bmsubGVuZ3RoLCBkYXRhLmhvc3QsIGRhdGEucG9ydCwgc29ja2V0LmNvbm4uaWQpXG4gICAgICAgICAgdGNwLndyaXRlKGNodW5rLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgIGZuKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuXG4gICAgICAgIHNvY2tldC5vbignZW5kJywgKCkgPT4ge1xuICAgICAgICAgIGxvZy52ZXJib3NlKCdpbycsICdSZWNlaXZlZCByZXF1ZXN0IHRvIGNsb3NlIGNvbm5lY3Rpb24gdG8gJXM6JXMgWyVzXScsIGRhdGEuaG9zdCwgZGF0YS5wb3J0LCBzb2NrZXQuY29ubi5pZClcbiAgICAgICAgICB0Y3AuZW5kKClcbiAgICAgICAgfSlcblxuICAgICAgICAvLyByZXBseSB3aXRoIGhvc3RuYW1lIG9uY2Ugd2UncmUgc2V0IHVwXG4gICAgICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBmbihvcy5ob3N0bmFtZSgpKVxuICAgICAgICB9XG5cbiAgICAgICAgc29ja2V0Lm9uKCdkaXNjb25uZWN0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGxvZy52ZXJib3NlKCdpbycsICdDbG9zZWQgY29ubmVjdGlvbiBbJXNdLCBjbG9zaW5nIGNvbm5lY3Rpb24gdG8gJXM6JXMgJywgc29ja2V0LmNvbm4uaWQsIGRhdGEuaG9zdCwgZGF0YS5wb3J0KVxuICAgICAgICAgIHRjcC5lbmQoKVxuICAgICAgICAgIHNvY2tldC5yZW1vdmVBbGxMaXN0ZW5lcnMoKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIHNlcnZlci5saXN0ZW4oY29uZmlnLnNlcnZlci5wb3J0LCBjb25maWcuc2VydmVyLmhvc3QsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYWRkcmVzcyA9IHNlcnZlci5hZGRyZXNzKClcbiAgICBsb2cuaW5mbygnZXhwcmVzcycsICdTZXJ2ZXIgbGlzdGVuaW5nIG9uICVzOiVzJywgYWRkcmVzcy5hZGRyZXNzLCBhZGRyZXNzLnBvcnQpXG4gIH0pXG59XG4iXX0=