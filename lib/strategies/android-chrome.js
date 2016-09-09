'use strict';

var DefaultStrategy = require('./default');

function AndroidChromeStrategy(options) {
  DefaultStrategy.call(this, options);
}

AndroidChromeStrategy.prototype = Object.create(DefaultStrategy.prototype);

AndroidChromeStrategy.prototype.pasteEventHandler = function (event) {
  DefaultStrategy.prototype.pasteEventHandler.call(this, event);
};

module.exports = AndroidChromeStrategy;
