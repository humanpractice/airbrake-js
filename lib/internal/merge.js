(function() {
  var merge;

  merge = function() {
    var dst, i, key, len, obj, objs;
    objs = Array.prototype.slice.call(arguments);
    dst = objs.shift() || {};
    for (i = 0, len = objs.length; i < len; i++) {
      obj = objs[i];
      for (key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          dst[key] = obj[key];
        }
      }
    }
    return dst;
  };

  module.exports = merge;

}).call(this);
