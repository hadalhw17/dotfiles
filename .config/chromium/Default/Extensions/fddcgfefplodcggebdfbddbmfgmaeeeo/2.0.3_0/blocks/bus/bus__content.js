(function () {

  var TIME_OUT = 60 * 1000;

  var BusContent = function (name) {
    this.connection = chrome.runtime.connect({name: name});
    this.activeMessages = {};
    this.startResponsesListening();
  };

  BusContent.prototype.generateMessageId = function () {
    var random = Math.random() * 1000000000000;
    return random.toFixed();
  };

  BusContent.prototype.setRejectTimeout = function (messageId) {
    setTimeout(function () {
      if (this.activeMessages[messageId]) {
        this.activeMessages[messageId].reject({message: 'Extension background does not respond'});
        delete this.activeMessages[messageId];
      }
    }.bind(this), TIME_OUT);
  };

  BusContent.prototype.startResponsesListening = function () {
    this.connection.onMessage.addListener(function (msg) {
      var storedMessage = this.activeMessages[msg.messageId];
      if (msg.error) {
        storedMessage.reject(msg.error);
      } else {
        storedMessage.resolve(msg.data);
      }
      //free memory
      delete this.activeMessages[msg.messageId];
    }.bind(this));
  };

  BusContent.prototype.sendMessage = function (message, data) {
    var promise = new Promise(function (resolve, reject) {
      var id = this.generateMessageId();

      try {
        this.connection.postMessage({
          messageId: id,
          message: message,
          data: data
        });
      } catch (e) {
        throw new Error('Can not connect to extension background. Try to reload page.');
      }

      this.activeMessages[id] = {
        resolve: resolve,
        reject: reject
      };

      this.setRejectTimeout(id);

    }.bind(this));

    return promise;
  };

  window.vkScrobbler.BusContent = BusContent;
})();
