(function() {
  var jsonifyNotice, report;

  jsonifyNotice = require('../internal/jsonify_notice');

  report = function(notice, opts) {
    var payload, req, url;
    url = opts.host + "/api/v3/projects/" + opts.projectId + "/create-notice?key=" + opts.projectKey;
    payload = jsonifyNotice(notice);
    req = new global.XMLHttpRequest();
    req.open('POST', url, true);
    req.send(payload);
    return req.onreadystatechange = function() {
      var resp;
      if (req.readyState === 4 && req.status === 200 && ((typeof console !== "undefined" && console !== null ? console.debug : void 0) != null)) {
        resp = JSON.parse(req.responseText);
        return console.debug("airbrake: error #%s was reported: %s", resp.id, resp.url);
      }
    };
  };

  module.exports = report;

}).call(this);
