(function() {
  var processor, rules, typeMessageRe;

  rules = [
    {
      name: 'v8',
      re: /^\s*at\s(.+?)\s\((?:(?:(.+):(\d+):(\d+))|(.+))\)$/,
      fn: function(m) {
        return {
          "function": m[1],
          file: m[2] || m[5],
          line: m[3] && parseInt(m[3], 10) || 0,
          column: m[4] && parseInt(m[4], 10) || 0
        };
      }
    }, {
      name: 'firefox30',
      re: /^(.*)@(.+):(\d+):(\d+)$/,
      fn: function(m) {
        var evaledRe, file, func, mm;
        func = m[1];
        file = m[2];
        evaledRe = /^(\S+)\s(line\s\d+\s>\seval.*)$/;
        if (mm = file.match(evaledRe)) {
          if (func.length > 0) {
            func = func + ' ' + mm[2];
          } else {
            func = mm[2];
          }
          file = mm[1];
        }
        return {
          "function": func,
          file: file,
          line: parseInt(m[3], 10),
          column: parseInt(m[4], 10)
        };
      }
    }, {
      name: 'firefox14',
      re: /^(.*)@(.+):(\d+)$/,
      fn: function(m, i, e) {
        var column;
        if (i === 0) {
          column = e.columnNumber || 0;
        } else {
          column = 0;
        }
        return {
          "function": m[1],
          file: m[2],
          line: parseInt(m[3], 10),
          column: column
        };
      }
    }, {
      name: 'v8-short',
      re: /^\s*at\s(.+):(\d+):(\d+)$/,
      fn: function(m) {
        return {
          "function": '',
          file: m[1],
          line: parseInt(m[2], 10),
          column: parseInt(m[3], 10)
        };
      }
    }, {
      name: 'phantomjs',
      re: /^\s*at\s(.+):(\d+)$/,
      fn: function(m) {
        return {
          "function": '',
          file: m[1],
          line: parseInt(m[2], 10),
          column: 0
        };
      }
    }, {
      name: 'default',
      re: /.+/,
      fn: function(m) {
        return {
          "function": m[0],
          file: '',
          line: 0,
          column: 0
        };
      }
    }
  ];

  typeMessageRe = /^\S+:\s.+$/;

  processor = function(e, cb) {
    var backtrace, i, j, k, len, len1, line, lines, m, msg, processorName, rule, stack, type, uncaughtExcRe;
    processorName = 'nostack';
    stack = e.stack || '';
    lines = stack.split('\n');
    backtrace = [];
    for (i = j = 0, len = lines.length; j < len; i = ++j) {
      line = lines[i];
      if (line === '') {
        continue;
      }
      for (k = 0, len1 = rules.length; k < len1; k++) {
        rule = rules[k];
        m = line.match(rule.re);
        if (!m) {
          continue;
        }
        processorName = rule.name;
        backtrace.push(rule.fn(m, i, e));
        break;
      }
    }
    if ((processorName === 'v8' || processorName === 'v8-short') && backtrace.length > 0 && backtrace[0]["function"].match(typeMessageRe)) {
      backtrace = backtrace.slice(1);
    }
    if (backtrace.length === 0 && ((e.fileName != null) || (e.lineNumber != null) || (e.columnNumber != null))) {
      backtrace.push({
        "function": '',
        file: e.fileName || '',
        line: parseInt(e.lineNumber, 10) || 0,
        column: parseInt(e.columnNumber, 10) || 0
      });
    }
    if (backtrace.length === 0 && ((e.filename != null) || (e.lineno != null) || (e.column != null) || (e.colno != null))) {
      backtrace.push({
        "function": '',
        file: e.filename || '',
        line: parseInt(e.lineno, 10) || 0,
        column: parseInt(e.column || e.colno, 10) || 0
      });
    }
    if (e.message != null) {
      msg = e.message;
    } else {
      msg = String(e);
    }
    if ((e.name != null) && e.name !== '') {
      type = e.name;
      msg = type + ': ' + msg;
    } else {
      uncaughtExcRe = /^Uncaught\s(.+?):\s.+$/;
      m = msg.match(uncaughtExcRe);
      if (m) {
        type = m[1];
      } else {
        type = '';
      }
    }
    return cb(processorName, {
      'type': type,
      'message': msg,
      'backtrace': backtrace
    });
  };

  module.exports = processor;

}).call(this);
