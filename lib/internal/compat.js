(function() {
  var base;

  if ((base = Array.prototype).indexOf == null) {
    base.indexOf = function(obj, start) {
      var i, j, ref, ref1;
      start = start || 0;
      for (i = j = ref = start, ref1 = this.length; ref <= ref1 ? j < ref1 : j > ref1; i = ref <= ref1 ? ++j : --j) {
        if (this[i] === obj) {
          return i;
        }
      }
      return -1;
    };
  }

}).call(this);
