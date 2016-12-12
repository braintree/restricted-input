'use strict';

var keyCannotMutateValue = require('../key-cannot-mutate-value');
var BaseStrategy = require('./base');

function AndroidChromeStrategy(options) {
  BaseStrategy.call(this, options);
}

AndroidChromeStrategy.prototype = Object.create(BaseStrategy.prototype);
AndroidChromeStrategy.prototype.constructor = AndroidChromeStrategy;

AndroidChromeStrategy.prototype._attachListeners = function () {
  var self = this;

  self.inputElement.addEventListener('keydown', function (event) {
    if (keyCannotMutateValue(event)) { return; }
    self._unformatInput(event);
  });

  // 'keypress' is not fired with some Android keyboards (see #23)
  self.inputElement.addEventListener('keypress', function (event) {
    if (keyCannotMutateValue(event)) { return; }
    self._unformatInput(event);
  });

  self.inputElement.addEventListener('keyup', function (event) {
    self._reformatInput(event);
  });

  self.inputElement.addEventListener('input', function (event) {
    self._reformatInput(event);
  });

  self.inputElement.addEventListener('paste', this.pasteEventHandler.bind(this));
};

AndroidChromeStrategy.prototype._prePasteEventHandler = function () {
  // the default strategy calls preventDefault here
  // but that removes the clipboard data in Android chrome
  // so we noop instead
};

AndroidChromeStrategy.prototype._postPasteEventHandler = function () {
  // the default strategy calls this without a timeout
  setTimeout(this._reformatAfterPaste.bind(this), 0);
};

module.exports = AndroidChromeStrategy;
