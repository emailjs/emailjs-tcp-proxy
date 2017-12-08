'use strict';

var _cluster = require('cluster');

var _cluster2 = _interopRequireDefault(_cluster);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _npmlog = require('npmlog');

var _npmlog2 = _interopRequireDefault(_npmlog);

var _proxy = require('./proxy');

var _proxy2 = _interopRequireDefault(_proxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_npmlog2.default.level = _config2.default.log.level;

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
  (0, _proxy2.default)();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zZXJ2ZXIuanMiXSwibmFtZXMiOlsibGV2ZWwiLCJsb2ciLCJleGl0Iiwic2lnbmFsIiwiZXhpdENvZGUiLCJ3YXJuIiwicHJvY2VzcyIsIm9uIiwiaXNNYXN0ZXIiLCJpZCIsIndvcmtlcnMiLCJraWxsIiwid29ya2VyIiwiaW5mbyIsInBpZCIsInNldFRpbWVvdXQiLCJmb3JrIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxpQkFBSUEsS0FBSixHQUFZLGlCQUFPQyxHQUFQLENBQVdELEtBQXZCOztBQUVBLElBQU1FLE9BQU8sU0FBUEEsSUFBTyxDQUFDQyxNQUFELEVBQVNDLFFBQVQ7QUFBQSxTQUFzQixZQUFNO0FBQ3ZDLHFCQUFJQyxJQUFKLENBQVMsTUFBVCxpQkFBOEJGLE1BQTlCO0FBQ0FHLFlBQVFKLElBQVIsQ0FBYUUsUUFBYjtBQUNELEdBSFk7QUFBQSxDQUFiOztBQUtBRSxRQUFRQyxFQUFSLENBQVcsUUFBWCxFQUFxQkwsS0FBSyxRQUFMLEVBQWUsQ0FBZixDQUFyQjtBQUNBSSxRQUFRQyxFQUFSLENBQVcsU0FBWCxFQUFzQkwsS0FBSyxTQUFMLEVBQWdCLENBQWhCLENBQXRCO0FBQ0FJLFFBQVFDLEVBQVIsQ0FBVyxTQUFYLEVBQXNCTCxLQUFLLFNBQUwsRUFBZ0IsQ0FBaEIsQ0FBdEI7QUFDQUksUUFBUUMsRUFBUixDQUFXLG1CQUFYLEVBQWdDTCxLQUFLLG9CQUFMLEVBQTJCLENBQTNCLENBQWhDO0FBQ0FJLFFBQVFDLEVBQVIsQ0FBVyxTQUFYLEVBQXNCTCxLQUFLLFNBQUwsRUFBZ0IsQ0FBaEIsQ0FBdEI7QUFDQUksUUFBUUMsRUFBUixDQUFXLFFBQVgsRUFBcUJMLEtBQUssUUFBTCxFQUFlLENBQWYsQ0FBckI7QUFDQUksUUFBUUMsRUFBUixDQUFXLG1CQUFYLEVBQWdDTCxLQUFLLG1CQUFMLEVBQTBCLENBQTFCLENBQWhDO0FBQ0FJLFFBQVFDLEVBQVIsQ0FBVyxNQUFYLEVBQW1CLFlBQU07QUFDdkIsTUFBSSxrQkFBUUMsUUFBWixFQUFzQjtBQUNwQixTQUFLLElBQUlDLEVBQVQsSUFBZSxrQkFBUUMsT0FBdkIsRUFBZ0M7QUFDOUIsd0JBQVFBLE9BQVIsQ0FBZ0JELEVBQWhCLEVBQW9CRSxJQUFwQjtBQUNEO0FBQ0Y7QUFDRFQsT0FBSyxDQUFMO0FBQ0QsQ0FQRDs7QUFTQSxJQUFJLGtCQUFRTSxRQUFaLEVBQXNCO0FBQ3BCLG9CQUFRRCxFQUFSLENBQVcsTUFBWCxFQUFtQixVQUFVSyxNQUFWLEVBQWtCO0FBQ25DLHFCQUFJQyxJQUFKLENBQVMsU0FBVCxFQUFvQiw0QkFBcEIsRUFBa0RELE9BQU9ILEVBQXpELEVBQTZERyxPQUFPTixPQUFQLENBQWVRLEdBQTVFO0FBQ0QsR0FGRDs7QUFJQSxvQkFBUVAsRUFBUixDQUFXLE1BQVgsRUFBbUIsVUFBVUssTUFBVixFQUFrQjtBQUNuQyxxQkFBSVAsSUFBSixDQUFTLFNBQVQsRUFBb0IsMEJBQXBCLEVBQWdETyxPQUFPSCxFQUF2RCxFQUEyREcsT0FBT04sT0FBUCxDQUFlUSxHQUExRTtBQUNBQyxlQUFXLFlBQU07QUFBRSx3QkFBUUMsSUFBUjtBQUFnQixLQUFuQyxFQUFxQyxJQUFyQztBQUNELEdBSEQ7O0FBS0Esb0JBQVFBLElBQVI7QUFDRCxDQVhELE1BV087QUFDTDtBQUNEIiwiZmlsZSI6InNlcnZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbHVzdGVyIGZyb20gJ2NsdXN0ZXInXG5pbXBvcnQgY29uZmlnIGZyb20gJ2NvbmZpZydcbmltcG9ydCBsb2cgZnJvbSAnbnBtbG9nJ1xuaW1wb3J0IHN0YXJ0UHJveHkgZnJvbSAnLi9wcm94eSdcblxubG9nLmxldmVsID0gY29uZmlnLmxvZy5sZXZlbFxuXG5jb25zdCBleGl0ID0gKHNpZ25hbCwgZXhpdENvZGUpID0+ICgpID0+IHtcbiAgbG9nLndhcm4oJ2V4aXQnLCBgRXhpdGVkIG9uICR7c2lnbmFsfWApXG4gIHByb2Nlc3MuZXhpdChleGl0Q29kZSlcbn1cblxucHJvY2Vzcy5vbignU0lHSU5UJywgZXhpdCgnU0lHSU5UJywgMSkpXG5wcm9jZXNzLm9uKCdTSUdVU1IxJywgZXhpdCgnU0lHVVNSMScsIDEpKVxucHJvY2Vzcy5vbignU0lHVVNSMicsIGV4aXQoJ1NJR1VTUjInLCAxKSlcbnByb2Nlc3Mub24oJ3VuY2F1Z2h0RXhjZXB0aW9uJywgZXhpdCgnVW5jYXVnaHQgZXhjZXB0aW9uJywgMSkpXG5wcm9jZXNzLm9uKCdTSUdURVJNJywgZXhpdCgnU0lHVEVSTScsIDApKVxucHJvY2Vzcy5vbignU0lHSU5UJywgZXhpdCgnU0lHSU5UJywgMCkpXG5wcm9jZXNzLm9uKCd1bmNhdWdodEV4Y2VwdGlvbicsIGV4aXQoJ3VuY2F1Z2h0RXhjZXB0aW9uJywgMSkpXG5wcm9jZXNzLm9uKCdleGl0JywgKCkgPT4ge1xuICBpZiAoY2x1c3Rlci5pc01hc3Rlcikge1xuICAgIGZvciAodmFyIGlkIGluIGNsdXN0ZXIud29ya2Vycykge1xuICAgICAgY2x1c3Rlci53b3JrZXJzW2lkXS5raWxsKClcbiAgICB9XG4gIH1cbiAgZXhpdCgwKSgpXG59KVxuXG5pZiAoY2x1c3Rlci5pc01hc3Rlcikge1xuICBjbHVzdGVyLm9uKCdmb3JrJywgZnVuY3Rpb24gKHdvcmtlcikge1xuICAgIGxvZy5pbmZvKCdjbHVzdGVyJywgJ0ZvcmtlZCB3b3JrZXIgIyVzIFtwaWQ6JXNdJywgd29ya2VyLmlkLCB3b3JrZXIucHJvY2Vzcy5waWQpXG4gIH0pXG5cbiAgY2x1c3Rlci5vbignZXhpdCcsIGZ1bmN0aW9uICh3b3JrZXIpIHtcbiAgICBsb2cud2FybignY2x1c3RlcicsICdXb3JrZXIgIyVzIFtwaWQ6JXNdIGRpZWQnLCB3b3JrZXIuaWQsIHdvcmtlci5wcm9jZXNzLnBpZClcbiAgICBzZXRUaW1lb3V0KCgpID0+IHsgY2x1c3Rlci5mb3JrKCkgfSwgMTAwMClcbiAgfSlcblxuICBjbHVzdGVyLmZvcmsoKVxufSBlbHNlIHtcbiAgc3RhcnRQcm94eSgpXG59XG4iXX0=