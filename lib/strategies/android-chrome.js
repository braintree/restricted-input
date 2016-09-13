'use strict';

var DefaultStrategy = require('./default');

function AndroidChromeStrategy(options) {
  DefaultStrategy.call(this, options);
}

AndroidChromeStrategy.prototype = Object.create(DefaultStrategy.prototype);
AndroidChromeStrategy.prototype.constructor = AndroidChromeStrategy;

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
