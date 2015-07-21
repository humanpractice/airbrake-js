(function() {
  var Client, merge;

  require('./internal/compat');

  merge = require('./internal/merge');

  Client = (function() {
    function Client(opts) {
      var reporter;
      if (opts == null) {
        opts = {};
      }
      this._projectId = opts.projectId || 0;
      this._projectKey = opts.projectKey || '';
      this._host = 'https://api.airbrake.io';
      this._context = {};
      this._params = {};
      this._env = {};
      this._session = {};
      this._processor = null;
      this._reporters = [];
      this._filters = [];
      if (opts.processor !== void 0) {
        this._processor = opts.processor;
      } else {
        this._processor = require('./processors/stack');
      }
      if (opts.reporter !== void 0) {
        this.addReporter(opts.reporter);
      } else {
        if ('withCredentials' in new global.XMLHttpRequest()) {
          reporter = require('./reporters/xhr');
        } else {
          reporter = require('./reporters/jsonp');
        }
        this.addReporter(reporter);
      }
    }

    Client.prototype.setProject = function(id, key) {
      this._projectId = id;
      return this._projectKey = key;
    };

    Client.prototype.setHost = function(host) {
      return this._host = host;
    };

    Client.prototype.addContext = function(context) {
      return merge(this._context, context);
    };

    Client.prototype.setEnvironmentName = function(envName) {
      return this._context.environment = envName;
    };

    Client.prototype.addParams = function(params) {
      return merge(this._params, params);
    };

    Client.prototype.addEnvironment = function(env) {
      return merge(this._env, env);
    };

    Client.prototype.addSession = function(session) {
      return merge(this._session, session);
    };

    Client.prototype.addReporter = function(reporter) {
      return this._reporters.push(reporter);
    };

    Client.prototype.addFilter = function(filter) {
      return this._filters.push(filter);
    };

    Client.prototype.push = function(err) {
      var defContext, ref;
      defContext = {
        language: 'JavaScript',
        sourceMapEnabled: true
      };
      if ((ref = global.navigator) != null ? ref.userAgent : void 0) {
        defContext.userAgent = global.navigator.userAgent;
      }
      if (global.location) {
        defContext.url = String(global.location);
      }
      return this._processor(err.error || err, (function(_this) {
        return function(name, errInfo) {
          var filterFn, j, k, len, len1, notice, ref1, ref2, reporterFn;
          notice = {
            notifier: {
              name: 'airbrake-js-' + name,
              version: '<%= pkg.version %>',
              url: 'https://github.com/airbrake/airbrake-js'
            },
            errors: [errInfo],
            context: merge(defContext, _this._context, err.context),
            params: merge({}, _this._params, err.params),
            environment: merge({}, _this._env, err.environment),
            session: merge({}, _this._session, err.session)
          };
          ref1 = _this._filters;
          for (j = 0, len = ref1.length; j < len; j++) {
            filterFn = ref1[j];
            if (!filterFn(notice)) {
              return;
            }
          }
          ref2 = _this._reporters;
          for (k = 0, len1 = ref2.length; k < len1; k++) {
            reporterFn = ref2[k];
            reporterFn(notice, {
              projectId: _this._projectId,
              projectKey: _this._projectKey,
              host: _this._host
            });
          }
        };
      })(this));
    };

    Client.prototype._wrapArguments = function(args) {
      var arg, i, j, len;
      for (i = j = 0, len = args.length; j < len; i = ++j) {
        arg = args[i];
        if (typeof arg === 'function') {
          args[i] = this.wrap(arg);
        }
      }
      return args;
    };

    Client.prototype.wrap = function(fn) {
      var airbrakeWrapper, prop, self;
      if (fn.__airbrake__) {
        return fn;
      }
      self = this;
      airbrakeWrapper = function() {
        var args, exc;
        args = self._wrapArguments(arguments);
        try {
          return fn.apply(this, args);
        } catch (_error) {
          exc = _error;
          args = Array.prototype.slice.call(arguments);
          self.push({
            error: exc,
            params: {
              "arguments": args
            }
          });
          return null;
        }
      };
      for (prop in fn) {
        if (fn.hasOwnProperty(prop)) {
          airbrakeWrapper[prop] = fn[prop];
        }
      }
      airbrakeWrapper.__airbrake__ = true;
      airbrakeWrapper.__inner__ = fn;
      return airbrakeWrapper;
    };

    return Client;

  })();

  module.exports = Client;

}).call(this);
