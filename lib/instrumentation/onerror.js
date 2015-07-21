(function() {
  var onerror;

  onerror = function(message, file, line, column, error) {
    if (message === 'Script error.') {
      return;
    }
    if (error) {
      return global.Airbrake.push({
        error: error
      });
    } else {
      return global.Airbrake.push({
        error: {
          message: message,
          fileName: file,
          lineNumber: line,
          columnNumber: column || 0
        }
      });
    }
  };

  models.exports = onerror;

}).call(this);
