jsonifyNotice = require('../internal/jsonify_notice')


report = (notice, opts) ->
  url = "#{opts.host}/api/v3/projects/#{opts.projectId}/create-notice?key=#{opts.projectKey}"
  payload = jsonifyNotice(notice)

  req = new global.XMLHttpRequest()
  req.open('POST', url, true)
  req.send(payload)
  req.onreadystatechange = ->
    if req.readyState != 4
      return
    if not console?.log?
      return
    switch req.status
      when 200
        resp = JSON.parse(req.responseText)
        console.log("airbrake: error #%s was reported: %s", resp.id, resp.url)
      else
        try
          resp = JSON.parse(req.responseText)
        catch
          console.log(
            "airbrake: reporting error failed with status code %d: %s",
            req.status, req.responseText,
          )
          return
        if req.status == 401
          console.log("airbrake: reporting error failed: %s", resp.error)
        else
          console.log("airbrake: reporting error failed: %s (payload: `%s`)", resp.error, payload)


module.exports = report
