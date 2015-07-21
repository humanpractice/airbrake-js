(function() {
  var cbCount, jsonifyNotice, report;

  jsonifyNotice = require('../internal/jsonify_notice');

  cbCount = 0;

  report = function(notice, opts) {
    var cbName, document, head, payload, removeScript, script, url;
    cbCount++;
    cbName = "airbrakeCb" + String(cbCount);
    global[cbName] = function(resp) {
      var _;
      if (typeof console !== "undefined" && console !== null) {
        if (typeof console.debug === "function") {
          console.debug("airbrake-js: error #%s was reported: %s", resp.id, resp.url);
        }
      }
      try {
        return delete global[cbName];
      } catch (_error) {
        _ = _error;
        return global[cbName] = void 0;
      }
    };
    payload = encodeURIComponent(jsonifyNotice(notice));
    url = opts.host + "/api/v3/projects/" + opts.projectId + "/create-notice?key=" + opts.projectKey + "&callback=" + cbName + "&body=" + payload;
    document = global.document;
    head = document.getElementsByTagName('head')[0];
    script = document.createElement('script');
    script.src = url;
    removeScript = function() {
      return head.removeChild(script);
    };
    script.onload = removeScript;
    script.onerror = removeScript;
    return head.appendChild(script);
  };

  module.exports = report;

}).call(this);
