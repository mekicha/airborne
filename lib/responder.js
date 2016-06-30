class Responder {
  constructor (config) {
    this.config = config;
    this.statusCode = 200;
    this.data = {};
    this.errorId = 0;
    this.errorMessage = null;
    this.response = {};
    this.i = 0;
  }

  setData (data) {
    this.data = data;
    return this;
  }

  get () {
    var contentLength = JSON.stringify(this.data).length;
    return {
      statusCode: this.statusCode,
      links: this.prepareHeaderLinks(this.data._links),
      contentLength: contentLength,
      body: this.data
    }
  }

  sendError (error, statusCode = 500) {
    this.statusCode = statusCode;
    var message = { error: error.message };
    if (this.config.debug === true) {
      message.stackTrace = error.stack;
    }
    this.send(message);
  }

  send (data) {
    this.setData(data);
    this.serverResponse.status(this.get().statusCode);
    this.serverResponse.send(
      this.get().body
    );
  }

  setServerResponse (response) {
    this.serverResponse = response;
  }

  prepareHeaderLinks (links) {
    this.headerLinks = [];
    for (var i in links) {
      this.headerLinks.push(
        '<' + links[i].schema + '>;' + 'rel="' + links[i].rel + '"'
      );
    }
    return this.headerLinks.join(',');
  }
}

module.exports = Responder;