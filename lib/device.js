'use strict';

var UA = navigator.userAgent;

var ANDROID_REGEX = /android/i;
var CHROME_REGEX = /Chrome/;

function isAndroid(ua) {
  return ANDROID_REGEX.test(ua || UA);
}

function _isChrome(ua) {
  return CHROME_REGEX.test(ua || UA);
}

function isAndroidChrome(uaArg) {
  var ua = uaArg || UA;

  return isAndroid(ua) && _isChrome(ua);
}

module.exports = {
  isAndroid: isAndroid,
  isAndroidChrome: isAndroidChrome
};
