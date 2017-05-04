'use strict';

var AndroidChromeStrategy = require('./android-chrome');

function OldAndroidWebviewStrategy(options) {
  AndroidChromeStrategy.call(this, options);
}

OldAndroidWebviewStrategy.prototype = Object.create(AndroidChromeStrategy.prototype);
OldAndroidWebviewStrategy.prototype.constructor = OldAndroidWebviewStrategy;

OldAndroidWebviewStrategy.prototype._reformatInput = function () {
  // the input.value is not updated right away, so we need to call reformat in a setTimeout to get access to it
  setTimeout(function () {
    AndroidChromeStrategy.prototype._reformatInput.call(this);
  }.bind(this), 0);
};

OldAndroidWebviewStrategy.prototype._unformatInput = function () {
  // the input.value is not updated right away, so we need to call unformat in a setTimeout to get access to it
  setTimeout(function () {
    AndroidChromeStrategy.prototype._unformatInput.call(this);
  }.bind(this), 0);
};

module.exports = OldAndroidWebviewStrategy;
