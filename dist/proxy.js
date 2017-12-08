'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (server, log) {
  (0, _socket2.default)(server).on('connection', function (socket) {
    var id = socket.conn.id;
    var remote = socket.conn.remoteAddress;
    log && log.info('io', 'New connection [%s] from %s', id, remote);

    socket.on('open', function (_ref, fn) {
      var host = _ref.host,
          port = _ref.port;

      log && log.verbose('io', 'Open request to %s:%s [%s]', host, port, id);
      var tcp = _net2.default.connect(port, host, function () {
        log && log.verbose('io', 'Opened tcp connection to %s:%s [%s]', host, port, id);

        tcp.on('data', function (chunk) {
          log && log.silly('io', 'Received %s bytes from %s:%s [%s]', chunk.length, host, port, id);
          socket.emit('data', chunk);
        });

        tcp.on('error', function (err) {
          log && log.verbose('io', 'Error for %s:%s [%s]: %s', host, port, id, err.message);
          socket.emit('error', err.message);
        });

        tcp.on('end', function () {
          return socket.emit('end');
        });

        tcp.on('close', function () {
          log && log.verbose('io', 'Closed tcp connection to %s:%s [%s]', host, port, id);
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
          log && log.silly('io', 'Sending %s bytes to %s:%s [%s]', chunk.length, host, port, id);
          tcp.write(chunk, function () {
            if (typeof fn === 'function') {
              fn();
            }
          });
        });

        socket.on('end', function () {
          log && log.verbose('io', 'Received request to close connection to %s:%s [%s]', host, port, id);
          tcp.end();
        });

        if (typeof fn === 'function') {
          fn(_os2.default.hostname()); // reply with hostname once we're set up
        }

        socket.on('disconnect', function () {
          log && log.verbose('io', 'Closed connection [%s], closing connection to %s:%s ', id, host, port);
          tcp.end();
          socket.removeAllListeners();
        });
      });
    });
  });
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wcm94eS5qcyJdLCJuYW1lcyI6WyJzZXJ2ZXIiLCJsb2ciLCJvbiIsImlkIiwic29ja2V0IiwiY29ubiIsInJlbW90ZSIsInJlbW90ZUFkZHJlc3MiLCJpbmZvIiwiZm4iLCJob3N0IiwicG9ydCIsInZlcmJvc2UiLCJ0Y3AiLCJjb25uZWN0Iiwic2lsbHkiLCJjaHVuayIsImxlbmd0aCIsImVtaXQiLCJlcnIiLCJtZXNzYWdlIiwicmVtb3ZlQWxsTGlzdGVuZXJzIiwid3JpdGUiLCJlbmQiLCJob3N0bmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7a0JBRWUsVUFBQ0EsTUFBRCxFQUFTQyxHQUFULEVBQWlCO0FBQzlCLHdCQUFTRCxNQUFULEVBQWlCRSxFQUFqQixDQUFvQixZQUFwQixFQUFrQyxrQkFBVTtBQUMxQyxRQUFNQyxLQUFLQyxPQUFPQyxJQUFQLENBQVlGLEVBQXZCO0FBQ0EsUUFBTUcsU0FBU0YsT0FBT0MsSUFBUCxDQUFZRSxhQUEzQjtBQUNBTixXQUFPQSxJQUFJTyxJQUFKLENBQVMsSUFBVCxFQUFlLDZCQUFmLEVBQThDTCxFQUE5QyxFQUFrREcsTUFBbEQsQ0FBUDs7QUFFQUYsV0FBT0YsRUFBUCxDQUFVLE1BQVYsRUFBa0IsZ0JBQWlCTyxFQUFqQixFQUF3QjtBQUFBLFVBQXJCQyxJQUFxQixRQUFyQkEsSUFBcUI7QUFBQSxVQUFmQyxJQUFlLFFBQWZBLElBQWU7O0FBQ3hDVixhQUFPQSxJQUFJVyxPQUFKLENBQVksSUFBWixFQUFrQiw0QkFBbEIsRUFBZ0RGLElBQWhELEVBQXNEQyxJQUF0RCxFQUE0RFIsRUFBNUQsQ0FBUDtBQUNBLFVBQU1VLE1BQU0sY0FBSUMsT0FBSixDQUFZSCxJQUFaLEVBQWtCRCxJQUFsQixFQUF3QixZQUFNO0FBQ3hDVCxlQUFPQSxJQUFJVyxPQUFKLENBQVksSUFBWixFQUFrQixxQ0FBbEIsRUFBeURGLElBQXpELEVBQStEQyxJQUEvRCxFQUFxRVIsRUFBckUsQ0FBUDs7QUFFQVUsWUFBSVgsRUFBSixDQUFPLE1BQVAsRUFBZSxpQkFBUztBQUN0QkQsaUJBQU9BLElBQUljLEtBQUosQ0FBVSxJQUFWLEVBQWdCLG1DQUFoQixFQUFxREMsTUFBTUMsTUFBM0QsRUFBbUVQLElBQW5FLEVBQXlFQyxJQUF6RSxFQUErRVIsRUFBL0UsQ0FBUDtBQUNBQyxpQkFBT2MsSUFBUCxDQUFZLE1BQVosRUFBb0JGLEtBQXBCO0FBQ0QsU0FIRDs7QUFLQUgsWUFBSVgsRUFBSixDQUFPLE9BQVAsRUFBZ0IsZUFBTztBQUNyQkQsaUJBQU9BLElBQUlXLE9BQUosQ0FBWSxJQUFaLEVBQWtCLDBCQUFsQixFQUE4Q0YsSUFBOUMsRUFBb0RDLElBQXBELEVBQTBEUixFQUExRCxFQUE4RGdCLElBQUlDLE9BQWxFLENBQVA7QUFDQWhCLGlCQUFPYyxJQUFQLENBQVksT0FBWixFQUFxQkMsSUFBSUMsT0FBekI7QUFDRCxTQUhEOztBQUtBUCxZQUFJWCxFQUFKLENBQU8sS0FBUCxFQUFjO0FBQUEsaUJBQU1FLE9BQU9jLElBQVAsQ0FBWSxLQUFaLENBQU47QUFBQSxTQUFkOztBQUVBTCxZQUFJWCxFQUFKLENBQU8sT0FBUCxFQUFnQixZQUFNO0FBQ3BCRCxpQkFBT0EsSUFBSVcsT0FBSixDQUFZLElBQVosRUFBa0IscUNBQWxCLEVBQXlERixJQUF6RCxFQUErREMsSUFBL0QsRUFBcUVSLEVBQXJFLENBQVA7QUFDQUMsaUJBQU9jLElBQVAsQ0FBWSxPQUFaOztBQUVBZCxpQkFBT2lCLGtCQUFQLENBQTBCLE1BQTFCO0FBQ0FqQixpQkFBT2lCLGtCQUFQLENBQTBCLEtBQTFCO0FBQ0QsU0FORDs7QUFRQWpCLGVBQU9GLEVBQVAsQ0FBVSxNQUFWLEVBQWtCLFVBQUNjLEtBQUQsRUFBUVAsRUFBUixFQUFlO0FBQy9CLGNBQUksQ0FBQ08sS0FBRCxJQUFVLENBQUNBLE1BQU1DLE1BQXJCLEVBQTZCO0FBQzNCLGdCQUFJLE9BQU9SLEVBQVAsS0FBYyxVQUFsQixFQUE4QjtBQUM1QkE7QUFDRDtBQUNEO0FBQ0Q7QUFDRFIsaUJBQU9BLElBQUljLEtBQUosQ0FBVSxJQUFWLEVBQWdCLGdDQUFoQixFQUFrREMsTUFBTUMsTUFBeEQsRUFBZ0VQLElBQWhFLEVBQXNFQyxJQUF0RSxFQUE0RVIsRUFBNUUsQ0FBUDtBQUNBVSxjQUFJUyxLQUFKLENBQVVOLEtBQVYsRUFBaUIsWUFBTTtBQUNyQixnQkFBSSxPQUFPUCxFQUFQLEtBQWMsVUFBbEIsRUFBOEI7QUFDNUJBO0FBQ0Q7QUFDRixXQUpEO0FBS0QsU0FiRDs7QUFlQUwsZUFBT0YsRUFBUCxDQUFVLEtBQVYsRUFBaUIsWUFBTTtBQUNyQkQsaUJBQU9BLElBQUlXLE9BQUosQ0FBWSxJQUFaLEVBQWtCLG9EQUFsQixFQUF3RUYsSUFBeEUsRUFBOEVDLElBQTlFLEVBQW9GUixFQUFwRixDQUFQO0FBQ0FVLGNBQUlVLEdBQUo7QUFDRCxTQUhEOztBQUtBLFlBQUksT0FBT2QsRUFBUCxLQUFjLFVBQWxCLEVBQThCO0FBQzVCQSxhQUFHLGFBQUdlLFFBQUgsRUFBSCxFQUQ0QixDQUNWO0FBQ25COztBQUVEcEIsZUFBT0YsRUFBUCxDQUFVLFlBQVYsRUFBd0IsWUFBWTtBQUNsQ0QsaUJBQU9BLElBQUlXLE9BQUosQ0FBWSxJQUFaLEVBQWtCLHNEQUFsQixFQUEwRVQsRUFBMUUsRUFBOEVPLElBQTlFLEVBQW9GQyxJQUFwRixDQUFQO0FBQ0FFLGNBQUlVLEdBQUo7QUFDQW5CLGlCQUFPaUIsa0JBQVA7QUFDRCxTQUpEO0FBS0QsT0FwRFcsQ0FBWjtBQXFERCxLQXZERDtBQXdERCxHQTdERDtBQThERCxDIiwiZmlsZSI6InByb3h5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNvY2tldGlvIGZyb20gJ3NvY2tldC5pbydcbmltcG9ydCBuZXQgZnJvbSAnbmV0J1xuaW1wb3J0IG9zIGZyb20gJ29zJ1xuXG5leHBvcnQgZGVmYXVsdCAoc2VydmVyLCBsb2cpID0+IHtcbiAgc29ja2V0aW8oc2VydmVyKS5vbignY29ubmVjdGlvbicsIHNvY2tldCA9PiB7XG4gICAgY29uc3QgaWQgPSBzb2NrZXQuY29ubi5pZFxuICAgIGNvbnN0IHJlbW90ZSA9IHNvY2tldC5jb25uLnJlbW90ZUFkZHJlc3NcbiAgICBsb2cgJiYgbG9nLmluZm8oJ2lvJywgJ05ldyBjb25uZWN0aW9uIFslc10gZnJvbSAlcycsIGlkLCByZW1vdGUpXG5cbiAgICBzb2NrZXQub24oJ29wZW4nLCAoeyBob3N0LCBwb3J0IH0sIGZuKSA9PiB7XG4gICAgICBsb2cgJiYgbG9nLnZlcmJvc2UoJ2lvJywgJ09wZW4gcmVxdWVzdCB0byAlczolcyBbJXNdJywgaG9zdCwgcG9ydCwgaWQpXG4gICAgICBjb25zdCB0Y3AgPSBuZXQuY29ubmVjdChwb3J0LCBob3N0LCAoKSA9PiB7XG4gICAgICAgIGxvZyAmJiBsb2cudmVyYm9zZSgnaW8nLCAnT3BlbmVkIHRjcCBjb25uZWN0aW9uIHRvICVzOiVzIFslc10nLCBob3N0LCBwb3J0LCBpZClcblxuICAgICAgICB0Y3Aub24oJ2RhdGEnLCBjaHVuayA9PiB7XG4gICAgICAgICAgbG9nICYmIGxvZy5zaWxseSgnaW8nLCAnUmVjZWl2ZWQgJXMgYnl0ZXMgZnJvbSAlczolcyBbJXNdJywgY2h1bmsubGVuZ3RoLCBob3N0LCBwb3J0LCBpZClcbiAgICAgICAgICBzb2NrZXQuZW1pdCgnZGF0YScsIGNodW5rKVxuICAgICAgICB9KVxuXG4gICAgICAgIHRjcC5vbignZXJyb3InLCBlcnIgPT4ge1xuICAgICAgICAgIGxvZyAmJiBsb2cudmVyYm9zZSgnaW8nLCAnRXJyb3IgZm9yICVzOiVzIFslc106ICVzJywgaG9zdCwgcG9ydCwgaWQsIGVyci5tZXNzYWdlKVxuICAgICAgICAgIHNvY2tldC5lbWl0KCdlcnJvcicsIGVyci5tZXNzYWdlKVxuICAgICAgICB9KVxuXG4gICAgICAgIHRjcC5vbignZW5kJywgKCkgPT4gc29ja2V0LmVtaXQoJ2VuZCcpKVxuXG4gICAgICAgIHRjcC5vbignY2xvc2UnLCAoKSA9PiB7XG4gICAgICAgICAgbG9nICYmIGxvZy52ZXJib3NlKCdpbycsICdDbG9zZWQgdGNwIGNvbm5lY3Rpb24gdG8gJXM6JXMgWyVzXScsIGhvc3QsIHBvcnQsIGlkKVxuICAgICAgICAgIHNvY2tldC5lbWl0KCdjbG9zZScpXG5cbiAgICAgICAgICBzb2NrZXQucmVtb3ZlQWxsTGlzdGVuZXJzKCdkYXRhJylcbiAgICAgICAgICBzb2NrZXQucmVtb3ZlQWxsTGlzdGVuZXJzKCdlbmQnKVxuICAgICAgICB9KVxuXG4gICAgICAgIHNvY2tldC5vbignZGF0YScsIChjaHVuaywgZm4pID0+IHtcbiAgICAgICAgICBpZiAoIWNodW5rIHx8ICFjaHVuay5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgZm4oKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuICAgICAgICAgIGxvZyAmJiBsb2cuc2lsbHkoJ2lvJywgJ1NlbmRpbmcgJXMgYnl0ZXMgdG8gJXM6JXMgWyVzXScsIGNodW5rLmxlbmd0aCwgaG9zdCwgcG9ydCwgaWQpXG4gICAgICAgICAgdGNwLndyaXRlKGNodW5rLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgIGZuKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuXG4gICAgICAgIHNvY2tldC5vbignZW5kJywgKCkgPT4ge1xuICAgICAgICAgIGxvZyAmJiBsb2cudmVyYm9zZSgnaW8nLCAnUmVjZWl2ZWQgcmVxdWVzdCB0byBjbG9zZSBjb25uZWN0aW9uIHRvICVzOiVzIFslc10nLCBob3N0LCBwb3J0LCBpZClcbiAgICAgICAgICB0Y3AuZW5kKClcbiAgICAgICAgfSlcblxuICAgICAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgZm4ob3MuaG9zdG5hbWUoKSkgLy8gcmVwbHkgd2l0aCBob3N0bmFtZSBvbmNlIHdlJ3JlIHNldCB1cFxuICAgICAgICB9XG5cbiAgICAgICAgc29ja2V0Lm9uKCdkaXNjb25uZWN0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGxvZyAmJiBsb2cudmVyYm9zZSgnaW8nLCAnQ2xvc2VkIGNvbm5lY3Rpb24gWyVzXSwgY2xvc2luZyBjb25uZWN0aW9uIHRvICVzOiVzICcsIGlkLCBob3N0LCBwb3J0KVxuICAgICAgICAgIHRjcC5lbmQoKVxuICAgICAgICAgIHNvY2tldC5yZW1vdmVBbGxMaXN0ZW5lcnMoKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxufVxuIl19