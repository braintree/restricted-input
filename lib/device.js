'use strict';

var UA = navigator.userAgent;

var ANDROID_REGEX = /android/i;
var CHROME_REGEX = /Chrome/;

function _isAndroid(ua) {
  return ANDROID_REGEX.test(ua || UA);
}

function _isChrome(ua) {
  return CHROME_REGEX.test(ua || UA);
}

function isAndroidChrome(uaArg) {
  var ua = uaArg || UA;

  return _isAndroid(ua) && _isChrome(ua);
}

function isIos(ua) {
  ua = ua || UA;
  return /iPhone|iPod|iPad/.test(ua);
}

module.exports = {
  isAndroidChrome: isAndroidChrome,
  isIos: isIos
};
