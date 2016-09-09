'use strict';

var DefaultStrategy = require('./default');

function AndroidChromeStrategy(options) {
  DefaultStrategy.call(this, options);
}

AndroidChromeStrategy.prototype = Object.create(DefaultStrategy.prototype);

AndroidChromeStrategy.prototype.pasteEventHandler = function (event) {
  // without this, the paste event is called twice
  // so if you were pasting abc it would result in
  // abcabc
  event.preventDefault();

  DefaultStrategy.prototype.pasteEventHandler.call(this, event);
};

module.exports = AndroidChromeStrategy;
