'use strict';

var _cluster = require('cluster');

var _cluster2 = _interopRequireDefault(_cluster);

var _npmlog = require('npmlog');

var _npmlog2 = _interopRequireDefault(_npmlog);

var _proxy = require('./proxy');

var _proxy2 = _interopRequireDefault(_proxy);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LOG_FORMAT = ':remote-addr [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer"';

_npmlog2.default.level = 'silly';
var port = process.env.PROXY_PORT || 8888;

var exit = function exit(signal, exitCode) {
  return function () {
    _npmlog2.default.warn('exit', 'Exited on ' + signal);
    process.exit(exitCode);
  };
};

process.on('SIGINT', exit('SIGINT', 1));
process.on('SIGUSR1', exit('SIGUSR1', 1));
process.on('SIGUSR2', exit('SIGUSR2', 1));
process.on('uncaughtException', exit('Uncaught exception', 1));
process.on('SIGTERM', exit('SIGTERM', 0));
process.on('SIGINT', exit('SIGINT', 0));
process.on('uncaughtException', exit('uncaughtException', 1));
process.on('exit', function () {
  if (_cluster2.default.isMaster) {
    for (var id in _cluster2.default.workers) {
      _cluster2.default.workers[id].kill();
    }
  }
  exit(0)();
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
  app.disable('x-powered-by');
  app.use((0, _morgan2.default)(LOG_FORMAT, {
    stream: { write: function write() {
        var line = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        return line.trim() && _npmlog2.default.http('express', line);
      } }
  }));
  server.listen(port, function () {
    var _server$address = server.address(),
        address = _server$address.address,
        port = _server$address.port;

    (0, _proxy2.default)(server, _npmlog2.default);
    _npmlog2.default.info('express', 'Server listening on %s:%s', address, port);
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zZXJ2ZXIuanMiXSwibmFtZXMiOlsiTE9HX0ZPUk1BVCIsImxldmVsIiwicG9ydCIsInByb2Nlc3MiLCJlbnYiLCJQUk9YWV9QT1JUIiwiZXhpdCIsInNpZ25hbCIsImV4aXRDb2RlIiwid2FybiIsIm9uIiwiaXNNYXN0ZXIiLCJpZCIsIndvcmtlcnMiLCJraWxsIiwid29ya2VyIiwiaW5mbyIsInBpZCIsInNldFRpbWVvdXQiLCJmb3JrIiwiYXBwIiwic2VydmVyIiwiZGlzYWJsZSIsInVzZSIsInN0cmVhbSIsIndyaXRlIiwibGluZSIsInRyaW0iLCJodHRwIiwibGlzdGVuIiwiYWRkcmVzcyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxhQUFhLGlHQUFuQjs7QUFFQSxpQkFBSUMsS0FBSixHQUFZLE9BQVo7QUFDQSxJQUFNQyxPQUFPQyxRQUFRQyxHQUFSLENBQVlDLFVBQVosSUFBMEIsSUFBdkM7O0FBRUEsSUFBTUMsT0FBTyxTQUFQQSxJQUFPLENBQUNDLE1BQUQsRUFBU0MsUUFBVDtBQUFBLFNBQXNCLFlBQU07QUFDdkMscUJBQUlDLElBQUosQ0FBUyxNQUFULGlCQUE4QkYsTUFBOUI7QUFDQUosWUFBUUcsSUFBUixDQUFhRSxRQUFiO0FBQ0QsR0FIWTtBQUFBLENBQWI7O0FBS0FMLFFBQVFPLEVBQVIsQ0FBVyxRQUFYLEVBQXFCSixLQUFLLFFBQUwsRUFBZSxDQUFmLENBQXJCO0FBQ0FILFFBQVFPLEVBQVIsQ0FBVyxTQUFYLEVBQXNCSixLQUFLLFNBQUwsRUFBZ0IsQ0FBaEIsQ0FBdEI7QUFDQUgsUUFBUU8sRUFBUixDQUFXLFNBQVgsRUFBc0JKLEtBQUssU0FBTCxFQUFnQixDQUFoQixDQUF0QjtBQUNBSCxRQUFRTyxFQUFSLENBQVcsbUJBQVgsRUFBZ0NKLEtBQUssb0JBQUwsRUFBMkIsQ0FBM0IsQ0FBaEM7QUFDQUgsUUFBUU8sRUFBUixDQUFXLFNBQVgsRUFBc0JKLEtBQUssU0FBTCxFQUFnQixDQUFoQixDQUF0QjtBQUNBSCxRQUFRTyxFQUFSLENBQVcsUUFBWCxFQUFxQkosS0FBSyxRQUFMLEVBQWUsQ0FBZixDQUFyQjtBQUNBSCxRQUFRTyxFQUFSLENBQVcsbUJBQVgsRUFBZ0NKLEtBQUssbUJBQUwsRUFBMEIsQ0FBMUIsQ0FBaEM7QUFDQUgsUUFBUU8sRUFBUixDQUFXLE1BQVgsRUFBbUIsWUFBTTtBQUN2QixNQUFJLGtCQUFRQyxRQUFaLEVBQXNCO0FBQ3BCLFNBQUssSUFBSUMsRUFBVCxJQUFlLGtCQUFRQyxPQUF2QixFQUFnQztBQUM5Qix3QkFBUUEsT0FBUixDQUFnQkQsRUFBaEIsRUFBb0JFLElBQXBCO0FBQ0Q7QUFDRjtBQUNEUixPQUFLLENBQUw7QUFDRCxDQVBEOztBQVNBLElBQUksa0JBQVFLLFFBQVosRUFBc0I7QUFDcEIsb0JBQVFELEVBQVIsQ0FBVyxNQUFYLEVBQW1CLFVBQVVLLE1BQVYsRUFBa0I7QUFDbkMscUJBQUlDLElBQUosQ0FBUyxTQUFULEVBQW9CLDRCQUFwQixFQUFrREQsT0FBT0gsRUFBekQsRUFBNkRHLE9BQU9aLE9BQVAsQ0FBZWMsR0FBNUU7QUFDRCxHQUZEOztBQUlBLG9CQUFRUCxFQUFSLENBQVcsTUFBWCxFQUFtQixVQUFVSyxNQUFWLEVBQWtCO0FBQ25DLHFCQUFJTixJQUFKLENBQVMsU0FBVCxFQUFvQiwwQkFBcEIsRUFBZ0RNLE9BQU9ILEVBQXZELEVBQTJERyxPQUFPWixPQUFQLENBQWVjLEdBQTFFO0FBQ0FDLGVBQVcsWUFBTTtBQUFFLHdCQUFRQyxJQUFSO0FBQWdCLEtBQW5DLEVBQXFDLElBQXJDO0FBQ0QsR0FIRDs7QUFLQSxvQkFBUUEsSUFBUjtBQUNELENBWEQsTUFXTztBQUNMLE1BQU1DLE1BQU0sd0JBQVo7QUFDQSxNQUFNQyxTQUFTLGtCQUFPRCxHQUFQLENBQWY7QUFDQUEsTUFBSUUsT0FBSixDQUFZLGNBQVo7QUFDQUYsTUFBSUcsR0FBSixDQUFRLHNCQUFPdkIsVUFBUCxFQUFtQjtBQUN6QndCLFlBQVEsRUFBRUMsT0FBTztBQUFBLFlBQUNDLElBQUQsdUVBQVEsRUFBUjtBQUFBLGVBQWVBLEtBQUtDLElBQUwsTUFBZSxpQkFBSUMsSUFBSixDQUFTLFNBQVQsRUFBb0JGLElBQXBCLENBQTlCO0FBQUEsT0FBVDtBQURpQixHQUFuQixDQUFSO0FBR0FMLFNBQU9RLE1BQVAsQ0FBYzNCLElBQWQsRUFBb0IsWUFBWTtBQUFBLDBCQUNObUIsT0FBT1MsT0FBUCxFQURNO0FBQUEsUUFDdkJBLE9BRHVCLG1CQUN2QkEsT0FEdUI7QUFBQSxRQUNkNUIsSUFEYyxtQkFDZEEsSUFEYzs7QUFFOUIseUJBQVltQixNQUFaO0FBQ0EscUJBQUlMLElBQUosQ0FBUyxTQUFULEVBQW9CLDJCQUFwQixFQUFpRGMsT0FBakQsRUFBMEQ1QixJQUExRDtBQUNELEdBSkQ7QUFLRCIsImZpbGUiOiJzZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2x1c3RlciBmcm9tICdjbHVzdGVyJ1xuaW1wb3J0IGxvZyBmcm9tICducG1sb2cnXG5pbXBvcnQgYXR0YWNoUHJveHkgZnJvbSAnLi9wcm94eSdcbmltcG9ydCBtb3JnYW4gZnJvbSAnbW9yZ2FuJ1xuaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcydcbmltcG9ydCB7IFNlcnZlciB9IGZyb20gJ2h0dHAnXG5cbmNvbnN0IExPR19GT1JNQVQgPSAnOnJlbW90ZS1hZGRyIFs6ZGF0ZV0gXCI6bWV0aG9kIDp1cmwgSFRUUC86aHR0cC12ZXJzaW9uXCIgOnN0YXR1cyA6cmVzW2NvbnRlbnQtbGVuZ3RoXSBcIjpyZWZlcnJlclwiJ1xuXG5sb2cubGV2ZWwgPSAnc2lsbHknXG5jb25zdCBwb3J0ID0gcHJvY2Vzcy5lbnYuUFJPWFlfUE9SVCB8fCA4ODg4XG5cbmNvbnN0IGV4aXQgPSAoc2lnbmFsLCBleGl0Q29kZSkgPT4gKCkgPT4ge1xuICBsb2cud2FybignZXhpdCcsIGBFeGl0ZWQgb24gJHtzaWduYWx9YClcbiAgcHJvY2Vzcy5leGl0KGV4aXRDb2RlKVxufVxuXG5wcm9jZXNzLm9uKCdTSUdJTlQnLCBleGl0KCdTSUdJTlQnLCAxKSlcbnByb2Nlc3Mub24oJ1NJR1VTUjEnLCBleGl0KCdTSUdVU1IxJywgMSkpXG5wcm9jZXNzLm9uKCdTSUdVU1IyJywgZXhpdCgnU0lHVVNSMicsIDEpKVxucHJvY2Vzcy5vbigndW5jYXVnaHRFeGNlcHRpb24nLCBleGl0KCdVbmNhdWdodCBleGNlcHRpb24nLCAxKSlcbnByb2Nlc3Mub24oJ1NJR1RFUk0nLCBleGl0KCdTSUdURVJNJywgMCkpXG5wcm9jZXNzLm9uKCdTSUdJTlQnLCBleGl0KCdTSUdJTlQnLCAwKSlcbnByb2Nlc3Mub24oJ3VuY2F1Z2h0RXhjZXB0aW9uJywgZXhpdCgndW5jYXVnaHRFeGNlcHRpb24nLCAxKSlcbnByb2Nlc3Mub24oJ2V4aXQnLCAoKSA9PiB7XG4gIGlmIChjbHVzdGVyLmlzTWFzdGVyKSB7XG4gICAgZm9yICh2YXIgaWQgaW4gY2x1c3Rlci53b3JrZXJzKSB7XG4gICAgICBjbHVzdGVyLndvcmtlcnNbaWRdLmtpbGwoKVxuICAgIH1cbiAgfVxuICBleGl0KDApKClcbn0pXG5cbmlmIChjbHVzdGVyLmlzTWFzdGVyKSB7XG4gIGNsdXN0ZXIub24oJ2ZvcmsnLCBmdW5jdGlvbiAod29ya2VyKSB7XG4gICAgbG9nLmluZm8oJ2NsdXN0ZXInLCAnRm9ya2VkIHdvcmtlciAjJXMgW3BpZDolc10nLCB3b3JrZXIuaWQsIHdvcmtlci5wcm9jZXNzLnBpZClcbiAgfSlcblxuICBjbHVzdGVyLm9uKCdleGl0JywgZnVuY3Rpb24gKHdvcmtlcikge1xuICAgIGxvZy53YXJuKCdjbHVzdGVyJywgJ1dvcmtlciAjJXMgW3BpZDolc10gZGllZCcsIHdvcmtlci5pZCwgd29ya2VyLnByb2Nlc3MucGlkKVxuICAgIHNldFRpbWVvdXQoKCkgPT4geyBjbHVzdGVyLmZvcmsoKSB9LCAxMDAwKVxuICB9KVxuXG4gIGNsdXN0ZXIuZm9yaygpXG59IGVsc2Uge1xuICBjb25zdCBhcHAgPSBleHByZXNzKClcbiAgY29uc3Qgc2VydmVyID0gU2VydmVyKGFwcClcbiAgYXBwLmRpc2FibGUoJ3gtcG93ZXJlZC1ieScpXG4gIGFwcC51c2UobW9yZ2FuKExPR19GT1JNQVQsIHtcbiAgICBzdHJlYW06IHsgd3JpdGU6IChsaW5lID0gJycpID0+IGxpbmUudHJpbSgpICYmIGxvZy5odHRwKCdleHByZXNzJywgbGluZSkgfVxuICB9KSlcbiAgc2VydmVyLmxpc3Rlbihwb3J0LCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3Qge2FkZHJlc3MsIHBvcnR9ID0gc2VydmVyLmFkZHJlc3MoKVxuICAgIGF0dGFjaFByb3h5KHNlcnZlciwgbG9nKVxuICAgIGxvZy5pbmZvKCdleHByZXNzJywgJ1NlcnZlciBsaXN0ZW5pbmcgb24gJXM6JXMnLCBhZGRyZXNzLCBwb3J0KVxuICB9KVxufVxuIl19