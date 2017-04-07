'use strict';

var UA = navigator.userAgent;

var isAndroid = require('browser-detection/is-android');
var isChrome = require('browser-detection/is-chrome');
var isIos = require('browser-detection/is-ios');
var isIE9 = require('browser-detection/is-ie9');

function _isOldSamsungBrowserOrSamsungWebview(ua) {
  return !isChrome(ua) && ua.indexOf('Samsung') > -1;
}

function isAndroidChrome(uaArg) {
  var ua = uaArg || UA;

  return isAndroid(ua) && isChrome(ua);
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
