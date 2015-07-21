(function() {
  var formatError, report;

  formatError = function(err) {
    var i, len, rec, ref, s;
    s = "";
    s += err.message + "\n";
    ref = err.backtrace;
    for (i = 0, len = ref.length; i < len; i++) {
      rec = ref[i];
      if (rec["function"] !== '') {
        s += " at " + rec["function"];
      }
      if (rec.file !== '') {
        s += " in " + rec.file + ":" + rec.line;
        if (rec.column !== 0) {
          s += ":" + rec.column;
        }
      }
      s += '\n';
    }
    return s;
  };

  report = function(notice) {
    var err, i, len, ref, results;
    ref = notice.errors;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      err = ref[i];
      results.push(typeof console !== "undefined" && console !== null ? typeof console.log === "function" ? console.log(formatError(err)) : void 0 : void 0);
    }
    return results;
  };

  module.exports = report;

}).call(this);
