'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Responder = function () {
  function Responder(config) {
    _classCallCheck(this, Responder);

    this.config = config;
    this.statusCode = 200;
    this.data = {};
    this.errorId = 0;
    this.errorMessage = null;
    this.response = {};
    this.i = 0;
  }

  _createClass(Responder, [{
    key: 'setData',
    value: function setData(data) {
      this.data = data;
      return this;
    }
  }, {
    key: 'get',
    value: function get() {
      var contentLength = this.data ? JSON.stringify(this.data).length : 0;
      var links = this.data ? this.data._links : null;
      return {
        statusCode: this.statusCode,
        links: this.prepareHeaderLinks(links),
        contentLength: contentLength,
        body: this.data
      };
    }
  }, {
    key: 'sendError',
    value: function sendError(error) {
      var statusCode = arguments.length <= 1 || arguments[1] === undefined ? 500 : arguments[1];

      this.statusCode = statusCode;
      var message = { error: error.message };
      if (this.config.debug === true) {
        message.stackTrace = error.stack;
      }
      this.send(message);
    }
  }, {
    key: 'send404',
    value: function send404() {
      this.sendError({ message: 'Route not found' }, 404);
    }
  }, {
    key: 'send',
    value: function send(data) {
      this.setData(data);
      this.serverResponse.status(this.get().statusCode);
      this.serverResponse.send(this.get().body);
    }
  }, {
    key: 'setServerResponse',
    value: function setServerResponse(response) {
      this.serverResponse = response;
    }
  }, {
    key: 'prepareHeaderLinks',
    value: function prepareHeaderLinks(links) {
      this.headerLinks = [];
      for (var i in links) {
        this.headerLinks.push('<' + links[i].schema + '>;' + 'rel="' + links[i].rel + '"');
      }
      return this.headerLinks.join(',');
    }
  }]);

  return Responder;
}();

module.exports = Responder;