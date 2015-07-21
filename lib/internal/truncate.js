(function() {
  var getAttr, truncate;

  getAttr = function(obj, attr) {
    var exc;
    try {
      return obj[attr];
    } catch (_error) {
      exc = _error;
      return void 0;
    }
  };

  truncate = function(value, n, depth) {
    var fn, getPath, keys, nn, seen;
    if (n == null) {
      n = 1000;
    }
    if (depth == null) {
      depth = 5;
    }
    nn = 0;
    keys = [];
    seen = [];
    getPath = function(value) {
      var i, index, j, path, ref;
      index = seen.indexOf(value);
      path = [keys[index]];
      for (i = j = ref = index; ref <= 0 ? j <= 0 : j >= 0; i = ref <= 0 ? ++j : --j) {
        if (seen[i] && getAttr(seen[i], path[0]) === value) {
          value = seen[i];
          path.unshift(keys[i]);
        }
      }
      return '~' + path.join('.');
    };
    fn = function(value, key, dd) {
      var dst, el, i, j, len, val;
      if (key == null) {
        key = '';
      }
      if (dd == null) {
        dd = 0;
      }
      nn++;
      if (nn > n) {
        return '[Truncated]';
      }
      if (value === null || value === void 0) {
        return value;
      }
      switch (typeof value) {
        case 'boolean':
        case 'number':
        case 'string':
        case 'function':
          return value;
        case 'object':
          break;
        default:
          return String(value);
      }
      if (value instanceof Boolean || value instanceof Number || value instanceof String || value instanceof Date || value instanceof RegExp) {
        return value;
      }
      if (seen.indexOf(value) >= 0) {
        return "[Circular " + (getPath(value)) + "]";
      }
      dd++;
      if (dd > depth) {
        return '[Truncated]';
      }
      keys.push(key);
      seen.push(value);
      nn--;
      if (Object.prototype.toString.apply(value) === '[object Array]') {
        dst = [];
        for (i = j = 0, len = value.length; j < len; i = ++j) {
          el = value[i];
          nn++;
          if (nn >= n) {
            break;
          }
          dst.push(fn(el, key = i, dd));
        }
        return dst;
      }
      dst = {};
      for (key in value) {
        if (!Object.prototype.hasOwnProperty.call(value, key)) {
          continue;
        }
        nn++;
        if (nn >= n) {
          break;
        }
        val = getAttr(value, key);
        if (val !== void 0) {
          dst[key] = fn(val, key = key, dd);
        }
      }
      return dst;
    };
    return fn(value);
  };

  module.exports = truncate;

}).call(this);
