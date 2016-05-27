'use strict';

var UA = navigator.userAgent;

function _isAndroid(ua) {
  return /android/i.test(ua || UA);
}

function _isChrome(ua) {
  return /Chrome/.test(ua || UA);
}

function isAndroidChrome(uaArg) {
  var ua = uaArg || UA;

  return _isAndroid(ua) && _isChrome(ua);
}

module.exports = {
  isAndroidChrome: isAndroidChrome
};
