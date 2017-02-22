'use strict';

var UA = navigator.userAgent;

var ANDROID_REGEX = /android/i;
var CHROME_REGEX = /Chrome/;
var IE9_REGEX = /MSIE 9/;

function _isAndroid(ua) {
  return ANDROID_REGEX.test(ua || UA);
}

function _isChrome(ua) {
  return CHROME_REGEX.test(ua || UA);
}

function _isOldSamsungBrowserOrSamsungWebview(ua) {
  return !_isChrome(ua) && ua.indexOf('Samsung') > -1;
}

function isIE9(ua) {
  ua = ua || UA;

  return IE9_REGEX.test(ua);
}

function isAndroidChrome(uaArg) {
  var ua = uaArg || UA;

  return _isAndroid(ua) && _isChrome(ua);
}

function isIos(ua) {
  ua = ua || UA;
  return /iPhone|iPod|iPad/.test(ua);
}

function isSamsungBrowser(ua) {
  ua = ua || UA;
  return /SamsungBrowser/.test(ua) || _isOldSamsungBrowserOrSamsungWebview(ua);
}

module.exports = {
  isIE9: isIE9,
  isAndroidChrome: isAndroidChrome,
  isIos: isIos,
  isSamsungBrowser: isSamsungBrowser
};
