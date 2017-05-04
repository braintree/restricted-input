'use strict';

// Android Devices on KitKat use Chromium based webviews. For some reason,
// the value of the inputs are not accessible in the event loop where the
// key event listeners are called. This causes formatting to get stuck
// on permacharacters. By putting them in setTimeouts, this fixes the
// problem. This causes other problems in non-webviews, so we give it
// its own strategy.

var AndroidChromeStrategy = require('./android-chrome');

function KitKatChromiumBasedWebViewStrategy(options) {
  AndroidChromeStrategy.call(this, options);
}

KitKatChromiumBasedWebViewStrategy.prototype = Object.create(AndroidChromeStrategy.prototype);
KitKatChromiumBasedWebViewStrategy.prototype.constructor = KitKatChromiumBasedWebViewStrategy;

KitKatChromiumBasedWebViewStrategy.prototype._reformatInput = function () {
  setTimeout(function () {
    AndroidChromeStrategy.prototype._reformatInput.call(this);
  }.bind(this), 0);
};

KitKatChromiumBasedWebViewStrategy.prototype._unformatInput = function () {
  setTimeout(function () {
    AndroidChromeStrategy.prototype._unformatInput.call(this);
  }.bind(this), 0);
};

module.exports = KitKatChromiumBasedWebViewStrategy;
