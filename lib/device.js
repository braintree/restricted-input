'use strict';

var UA = navigator.userAgent;

var isAndroid = require('browser-detection/is-android');
var isIos = require('browser-detection/is-ios');
var isIE9 = require('browser-detection/is-ie9');

var CHROME_REGEX = /Chrome/;
// Old Android Webviews used specific versions of Chrome with 0.0.0 as their version suffix
var OLD_ANDROID_WEBVIEW_REGEX = /Chrome\/\d*\.0\.0\.0/;

function _isChrome(ua) {
  return CHROME_REGEX.test(ua || UA);
}

function _isOldSamsungBrowserOrSamsungWebview(ua) {
  return !_isChrome(ua) && ua.indexOf('Samsung') > -1;
}

function isOldAndroidChromeBasedWebview(uaArg) {
  var ua = uaArg || UA;

  return isAndroid(ua) && OLD_ANDROID_WEBVIEW_REGEX.test(ua);
}

function isAndroidChrome(uaArg) {
  var ua = uaArg || UA;

  return isAndroid(ua) && _isChrome(ua);
}

function isSamsungBrowser(ua) {
  ua = ua || UA;
  return /SamsungBrowser/.test(ua) || _isOldSamsungBrowserOrSamsungWebview(ua);
}

module.exports = {
  isIE9: isIE9,
  isAndroidChrome: isAndroidChrome,
  isIos: isIos,
  isOldAndroidChromeBasedWebview: isOldAndroidChromeBasedWebview,
  isSamsungBrowser: isSamsungBrowser
};
