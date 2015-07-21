(function() {
  var instrumentJQuery;

  instrumentJQuery = function(client, jq) {
    var jqCallbacks, jqEventAdd, jqReady, wrapArguments;
    if (jq == null) {
      jq = global.jQuery;
    }
    wrapArguments = function(args) {
      var arg, i, j, len, type;
      for (i = j = 0, len = args.length; j < len; i = ++j) {
        arg = args[i];
        type = typeof arg;
        if (type === 'function') {
          args[i] = client.wrap(arg);
        } else if (arg && arg.length && type !== 'string') {
          args[i] = wrapArguments(arg);
        }
      }
      return args;
    };
    jqEventAdd = jq.event.add;
    jq.event.add = function(elem, types, handler, data, selector) {
      if (handler.handler) {
        if (!handler.handler.guid) {
          handler.handler.guid = jq.guid++;
        }
        handler.handler = client.wrap(handler.handler);
      } else {
        if (!handler.guid) {
          handler.guid = jq.guid++;
        }
        handler = client.wrap(handler);
      }
      return jqEventAdd(elem, types, handler, data, selector);
    };
    jqCallbacks = jq.Callbacks;
    jq.Callbacks = function(options) {
      var cb, cbAdd;
      cb = jqCallbacks(options);
      cbAdd = cb.add;
      cb.add = function() {
        return cbAdd.apply(this, wrapArguments(arguments));
      };
      return cb;
    };
    jqReady = jq.fn.ready;
    jq.fn.ready = function(fn) {
      return jqReady(client.wrap(fn));
    };
    return jq;
  };

  module.exports = instrumentJQuery;

}).call(this);
