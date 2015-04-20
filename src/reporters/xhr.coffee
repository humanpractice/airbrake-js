jsonifyNotice = require('../internal/jsonify_notice')


report = (notice, opts, promise) ->
  url = "#{opts.host}/api/v3/projects/#{opts.projectId}/notices?key=#{opts.projectKey}"
  payload = jsonifyNotice(notice)

  req = new global.XMLHttpRequest()
  req.open('POST', url, true)
  req.setRequestHeader('Content-Type', 'application/json')
  req.send(payload)
  req.onreadystatechange = ->
    if req.readyState == 4 and req.status == 201 and console?.debug?
      resp = JSON.parse(req.responseText)
      notice.id = resp.id
      promise.resolve(notice)
      console?.debug?("airbrake: error #%s was reported: %s", resp.id, resp.url)


module.exports = report
