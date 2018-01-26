'use strict';

var device = require('./lib/device');

module.exports = function () {
  // Digits get dropped in non Chrome Android browsers browser
  // so we only support formatting on non-Android devices
  // and Android devices using Google Chrome
  return !device.isAndroid() || device.isAndroidChrome();
};
