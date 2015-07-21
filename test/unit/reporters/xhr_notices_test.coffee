expect = require("chai").expect
sinon = require("sinon")

reporter = require("../../../src/reporters/xhr_notices")

MockXhr = ->
MockXhr.prototype = {
  open: ->
  send: ->
  setRequestHeader: ->
}

describe "XhrNoticesReporter", ->
  oldXhr = null
  beforeEach ->
    oldXhr = global.XMLHttpRequest
    global.XMLHttpRequest = MockXhr
  afterEach ->
    global.XMLHttpRequest = oldXhr

  describe "report", ->
    it "opens async POST to url", ->
      spy = sinon.spy(global.XMLHttpRequest.prototype, 'open')
      reporter({}, {projectId: '[project_id]', projectKey: '[project_key]', host: 'https://api.airbrake.io'})
      expect(spy).to.have.been.calledWith("POST", "https://api.airbrake.io/api/v3/projects/[project_id]/notices?key=[project_key]", true)
      global.XMLHttpRequest.prototype.open.restore()

    it "opens POST to custom url", ->
      spy = sinon.spy(global.XMLHttpRequest.prototype, 'open')
      reporter({}, {projectId: '[project_id]', projectKey: '[project_key]', host: 'https://custom.domain.com'})
      expect(spy).to.have.been.calledWith("POST", "https://custom.domain.com/api/v3/projects/[project_id]/notices?key=[project_key]", true)
      global.XMLHttpRequest.prototype.open.restore()
