'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _npmlog = require('npmlog');

var _npmlog2 = _interopRequireDefault(_npmlog);

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

_npmlog2.default.level = 'error';
var LOG_FORMAT = ':remote-addr [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer"';

exports.default = function (port) {
  return new Promise(function (resolve) {
    var app = (0, _express2.default)();
    var server = (0, _http.Server)(app);
    var io = (0, _socket2.default)(server);

    app.disable('x-powered-by');
    app.use((0, _morgan2.default)(LOG_FORMAT, {
      stream: { write: function write() {
          var line = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
          return line.trim() && _npmlog2.default.http('express', line);
        } }
    }));

    server.listen(port, function () {
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
  var id = socket.conn.id;
  var remote = socket.conn.remoteAddress;
  _npmlog2.default.info('io', 'New connection [%s] from %s', id, remote);

  socket.on('open', function (_ref, fn) {
    var host = _ref.host,
        port = _ref.port;

    _npmlog2.default.verbose('io', 'Open request to %s:%s [%s]', host, port, id);
    var tcp = _net2.default.connect(port, host, function () {
      _npmlog2.default.verbose('io', 'Opened tcp connection to %s:%s [%s]', host, port, id);

      tcp.on('data', function (chunk) {
        _npmlog2.default.silly('io', 'Received %s bytes from %s:%s [%s]', chunk.length, host, port, id);
        socket.emit('data', chunk);
      });

      tcp.on('error', function (err) {
        _npmlog2.default.verbose('io', 'Error for %s:%s [%s]: %s', host, port, id, err.message);
        socket.emit('error', err.message);
      });

      tcp.on('end', function () {
        return socket.emit('end');
      });

      tcp.on('close', function () {
        _npmlog2.default.verbose('io', 'Closed tcp connection to %s:%s [%s]', host, port, id);
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
        _npmlog2.default.silly('io', 'Sending %s bytes to %s:%s [%s]', chunk.length, host, port, id);
        tcp.write(chunk, function () {
          if (typeof fn === 'function') {
            fn();
          }
        });
      });

      socket.on('end', function () {
        _npmlog2.default.verbose('io', 'Received request to close connection to %s:%s [%s]', host, port, id);
        tcp.end();
      });

      if (typeof fn === 'function') {
        fn(_os2.default.hostname()); // reply with hostname once we're set up
      }

      socket.on('disconnect', function () {
        _npmlog2.default.verbose('io', 'Closed connection [%s], closing connection to %s:%s ', id, host, port);
        tcp.end();
        socket.removeAllListeners();
      });
    });
  });
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wcm94eS5qcyJdLCJuYW1lcyI6WyJsZXZlbCIsIkxPR19GT1JNQVQiLCJwb3J0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJhcHAiLCJzZXJ2ZXIiLCJpbyIsImRpc2FibGUiLCJ1c2UiLCJzdHJlYW0iLCJ3cml0ZSIsImxpbmUiLCJ0cmltIiwiaHR0cCIsImxpc3RlbiIsIm9uIiwib25Tb2NrZXRJbmNvbWluZyIsImFkZHJlc3MiLCJpbmZvIiwiaWQiLCJzb2NrZXQiLCJjb25uIiwicmVtb3RlIiwicmVtb3RlQWRkcmVzcyIsImZuIiwiaG9zdCIsInZlcmJvc2UiLCJ0Y3AiLCJjb25uZWN0Iiwic2lsbHkiLCJjaHVuayIsImxlbmd0aCIsImVtaXQiLCJlcnIiLCJtZXNzYWdlIiwicmVtb3ZlQWxsTGlzdGVuZXJzIiwiZW5kIiwiaG9zdG5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsaUJBQUlBLEtBQUosR0FBWSxPQUFaO0FBQ0EsSUFBTUMsYUFBYSxpR0FBbkI7O2tCQUVlLFVBQUNDLElBQUQ7QUFBQSxTQUFVLElBQUlDLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQWE7QUFDaEQsUUFBTUMsTUFBTSx3QkFBWjtBQUNBLFFBQU1DLFNBQVMsa0JBQU9ELEdBQVAsQ0FBZjtBQUNBLFFBQU1FLEtBQUssc0JBQVNELE1BQVQsQ0FBWDs7QUFFQUQsUUFBSUcsT0FBSixDQUFZLGNBQVo7QUFDQUgsUUFBSUksR0FBSixDQUFRLHNCQUFPUixVQUFQLEVBQW1CO0FBQ3pCUyxjQUFRLEVBQUVDLE9BQU87QUFBQSxjQUFDQyxJQUFELHVFQUFRLEVBQVI7QUFBQSxpQkFBZUEsS0FBS0MsSUFBTCxNQUFlLGlCQUFJQyxJQUFKLENBQVMsU0FBVCxFQUFvQkYsSUFBcEIsQ0FBOUI7QUFBQSxTQUFUO0FBRGlCLEtBQW5CLENBQVI7O0FBSUFOLFdBQU9TLE1BQVAs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TTtBQUNyQixjQUFJLE9BQU9OLEVBQVAsS0FBYyxVQUFsQixFQUE4QjtBQUM1QkE7QUFDRDtBQUNGLFNBSkQ7QUFLRCxPQWJEOztBQWVBSixhQUFPTCxFQUFQLENBQVUsS0FBVixFQUFpQixZQUFNO0FBQ3JCLHlCQUFJVyxPQUFKLENBQVksSUFBWixFQUFrQixvREFBbEIsRUFBd0VELElBQXhFLEVBQThFeEIsSUFBOUUsRUFBb0ZrQixFQUFwRjtBQUNBUSxZQUFJUyxHQUFKO0FBQ0QsT0FIRDs7QUFLQSxVQUFJLE9BQU9aLEVBQVAsS0FBYyxVQUFsQixFQUE4QjtBQUM1QkEsV0FBRyxhQUFHYSxRQUFILEVBQUgsRUFENEIsQ0FDVjtBQUNuQjs7QUFFRGpCLGFBQU9MLEVBQVAsQ0FBVSxZQUFWLEVBQXdCLFlBQVk7QUFDbEMseUJBQUlXLE9BQUosQ0FBWSxJQUFaLEVBQWtCLHNEQUFsQixFQUEwRVAsRUFBMUUsRUFBOEVNLElBQTlFLEVBQW9GeEIsSUFBcEY7QUFDQTBCLFlBQUlTLEdBQUo7QUFDQWhCLGVBQU9lLGtCQUFQO0FBQ0QsT0FKRDtBQUtELEtBcERXLENBQVo7QUFxREQsR0F2REQ7QUF3REQsQ0E3REQiLCJmaWxlIjoicHJveHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbG9nIGZyb20gJ25wbWxvZydcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnXG5pbXBvcnQgeyBTZXJ2ZXIgfSBmcm9tICdodHRwJ1xuaW1wb3J0IHNvY2tldGlvIGZyb20gJ3NvY2tldC5pbydcbmltcG9ydCBuZXQgZnJvbSAnbmV0J1xuaW1wb3J0IG9zIGZyb20gJ29zJ1xuaW1wb3J0IG1vcmdhbiBmcm9tICdtb3JnYW4nXG5cbmxvZy5sZXZlbCA9ICdlcnJvcidcbmNvbnN0IExPR19GT1JNQVQgPSAnOnJlbW90ZS1hZGRyIFs6ZGF0ZV0gXCI6bWV0aG9kIDp1cmwgSFRUUC86aHR0cC12ZXJzaW9uXCIgOnN0YXR1cyA6cmVzW2NvbnRlbnQtbGVuZ3RoXSBcIjpyZWZlcnJlclwiJ1xuXG5leHBvcnQgZGVmYXVsdCAocG9ydCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgY29uc3QgYXBwID0gZXhwcmVzcygpXG4gIGNvbnN0IHNlcnZlciA9IFNlcnZlcihhcHApXG4gIGNvbnN0IGlvID0gc29ja2V0aW8oc2VydmVyKVxuXG4gIGFwcC5kaXNhYmxlKCd4LXBvd2VyZWQtYnknKVxuICBhcHAudXNlKG1vcmdhbihMT0dfRk9STUFULCB7XG4gICAgc3RyZWFtOiB7IHdyaXRlOiAobGluZSA9ICcnKSA9PiBsaW5lLnRyaW0oKSAmJiBsb2cuaHR0cCgnZXhwcmVzcycsIGxpbmUpIH1cbiAgfSkpXG5cbiAgc2VydmVyLmxpc3Rlbihwb3J0LCBmdW5jdGlvbiAoKSB7XG4gICAgaW8ub24oJ2Nvbm5lY3Rpb24nLCBvblNvY2tldEluY29taW5nKVxuICAgIGNvbnN0IHthZGRyZXNzLCBwb3J0fSA9IHNlcnZlci5hZGRyZXNzKClcbiAgICBsb2cuaW5mbygnZXhwcmVzcycsICdTZXJ2ZXIgbGlzdGVuaW5nIG9uICVzOiVzJywgYWRkcmVzcywgcG9ydClcbiAgICByZXNvbHZlKHNlcnZlcilcbiAgfSlcbn0pXG5cbmNvbnN0IG9uU29ja2V0SW5jb21pbmcgPSBzb2NrZXQgPT4ge1xuICBjb25zdCBpZCA9IHNvY2tldC5jb25uLmlkXG4gIGNvbnN0IHJlbW90ZSA9IHNvY2tldC5jb25uLnJlbW90ZUFkZHJlc3NcbiAgbG9nLmluZm8oJ2lvJywgJ05ldyBjb25uZWN0aW9uIFslc10gZnJvbSAlcycsIGlkLCByZW1vdGUpXG5cbiAgc29ja2V0Lm9uKCdvcGVuJywgKHsgaG9zdCwgcG9ydCB9LCBmbikgPT4ge1xuICAgIGxvZy52ZXJib3NlKCdpbycsICdPcGVuIHJlcXVlc3QgdG8gJXM6JXMgWyVzXScsIGhvc3QsIHBvcnQsIGlkKVxuICAgIGNvbnN0IHRjcCA9IG5ldC5jb25uZWN0KHBvcnQsIGhvc3QsICgpID0+IHtcbiAgICAgIGxvZy52ZXJib3NlKCdpbycsICdPcGVuZWQgdGNwIGNvbm5lY3Rpb24gdG8gJXM6JXMgWyVzXScsIGhvc3QsIHBvcnQsIGlkKVxuXG4gICAgICB0Y3Aub24oJ2RhdGEnLCBjaHVuayA9PiB7XG4gICAgICAgIGxvZy5zaWxseSgnaW8nLCAnUmVjZWl2ZWQgJXMgYnl0ZXMgZnJvbSAlczolcyBbJXNdJywgY2h1bmsubGVuZ3RoLCBob3N0LCBwb3J0LCBpZClcbiAgICAgICAgc29ja2V0LmVtaXQoJ2RhdGEnLCBjaHVuaylcbiAgICAgIH0pXG5cbiAgICAgIHRjcC5vbignZXJyb3InLCBlcnIgPT4ge1xuICAgICAgICBsb2cudmVyYm9zZSgnaW8nLCAnRXJyb3IgZm9yICVzOiVzIFslc106ICVzJywgaG9zdCwgcG9ydCwgaWQsIGVyci5tZXNzYWdlKVxuICAgICAgICBzb2NrZXQuZW1pdCgnZXJyb3InLCBlcnIubWVzc2FnZSlcbiAgICAgIH0pXG5cbiAgICAgIHRjcC5vbignZW5kJywgKCkgPT4gc29ja2V0LmVtaXQoJ2VuZCcpKVxuXG4gICAgICB0Y3Aub24oJ2Nsb3NlJywgKCkgPT4ge1xuICAgICAgICBsb2cudmVyYm9zZSgnaW8nLCAnQ2xvc2VkIHRjcCBjb25uZWN0aW9uIHRvICVzOiVzIFslc10nLCBob3N0LCBwb3J0LCBpZClcbiAgICAgICAgc29ja2V0LmVtaXQoJ2Nsb3NlJylcblxuICAgICAgICBzb2NrZXQucmVtb3ZlQWxsTGlzdGVuZXJzKCdkYXRhJylcbiAgICAgICAgc29ja2V0LnJlbW92ZUFsbExpc3RlbmVycygnZW5kJylcbiAgICAgIH0pXG5cbiAgICAgIHNvY2tldC5vbignZGF0YScsIChjaHVuaywgZm4pID0+IHtcbiAgICAgICAgaWYgKCFjaHVuayB8fCAhY2h1bmsubGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgZm4oKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBsb2cuc2lsbHkoJ2lvJywgJ1NlbmRpbmcgJXMgYnl0ZXMgdG8gJXM6JXMgWyVzXScsIGNodW5rLmxlbmd0aCwgaG9zdCwgcG9ydCwgaWQpXG4gICAgICAgIHRjcC53cml0ZShjaHVuaywgKCkgPT4ge1xuICAgICAgICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGZuKClcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBzb2NrZXQub24oJ2VuZCcsICgpID0+IHtcbiAgICAgICAgbG9nLnZlcmJvc2UoJ2lvJywgJ1JlY2VpdmVkIHJlcXVlc3QgdG8gY2xvc2UgY29ubmVjdGlvbiB0byAlczolcyBbJXNdJywgaG9zdCwgcG9ydCwgaWQpXG4gICAgICAgIHRjcC5lbmQoKVxuICAgICAgfSlcblxuICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBmbihvcy5ob3N0bmFtZSgpKSAvLyByZXBseSB3aXRoIGhvc3RuYW1lIG9uY2Ugd2UncmUgc2V0IHVwXG4gICAgICB9XG5cbiAgICAgIHNvY2tldC5vbignZGlzY29ubmVjdCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbG9nLnZlcmJvc2UoJ2lvJywgJ0Nsb3NlZCBjb25uZWN0aW9uIFslc10sIGNsb3NpbmcgY29ubmVjdGlvbiB0byAlczolcyAnLCBpZCwgaG9zdCwgcG9ydClcbiAgICAgICAgdGNwLmVuZCgpXG4gICAgICAgIHNvY2tldC5yZW1vdmVBbGxMaXN0ZW5lcnMoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxufVxuIl19