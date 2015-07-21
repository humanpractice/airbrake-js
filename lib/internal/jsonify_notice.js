(function() {
  var jsonifyNotice, truncate, truncateObj;

  truncate = require('./truncate');

  truncateObj = function(obj, n) {
    var dst, key;
    if (n == null) {
      n = 1000;
    }
    dst = {};
    for (key in obj) {
      dst[key] = truncate(obj[key], n = n);
    }
    return dst;
  };

  jsonifyNotice = function(notice, n, maxLength) {
    var err, s;
    if (n == null) {
      n = 1000;
    }
    if (maxLength == null) {
      maxLength = 64000;
    }
    while (true) {
      notice.params = truncateObj(notice.params, n = n);
      notice.environment = truncateObj(notice.environment, n = n);
      notice.session = truncateObj(notice.session, n = n);
      s = JSON.stringify(notice);
      if (s.length < maxLength) {
        return s;
      }
      if (n === 0) {
        break;
      }
      n = Math.floor(n / 2);
    }
    err = new Error("airbrake-js: cannot jsonify notice (length=" + s.length + " maxLength=" + maxLength + ")");
    err.params = {
      json: s.slice(0, +Math.floor(n / 2) + 1 || 9e9) + '...'
    };
    throw err;
  };

  module.exports = jsonifyNotice;

}).call(this);
