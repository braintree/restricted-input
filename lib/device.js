'use strict';

var UA = global.navigator && global.navigator.userAgent;

var isAndroid = require('@braintree/browser-detection/is-android');
var isChromeOs = require('@braintree/browser-detection/is-chrome-os');
var isChrome = require('@braintree/browser-detection/is-chrome');
var isIos = require('@braintree/browser-detection/is-ios');
var isIE9 = require('@braintree/browser-detection/is-ie9');

// Old Android Webviews used specific versions of Chrome with 0.0.0 as their version suffix
// https://developer.chrome.com/multidevice/user-agent#webview_user_agent
var KITKAT_WEBVIEW_REGEX = /Version\/\d\.\d* Chrome\/\d*\.0\.0\.0/;

function _isOldSamsungBrowserOrSamsungWebview(ua) {
  return !isChrome(ua) && ua.indexOf('Samsung') > -1;
}

function isKitKatWebview(uaArg) {
  var ua = uaArg || UA;

  return isAndroid(ua) && KITKAT_WEBVIEW_REGEX.test(ua);
}

function isAndroidChrome(uaArg) {
  var ua = uaArg || UA;

  return (isAndroid(ua) || isChromeOs(ua)) && isChrome(ua);
}

function isSamsungBrowser(ua) {
  ua = ua || UA;

  return /SamsungBrowser/.test(ua) || _isOldSamsungBrowserOrSamsungWebview(ua);
}

module.exports = {
  isIE9: isIE9,
  isAndroidChrome: isAndroidChrome,
  isIos: isIos,
  isKitKatWebview: isKitKatWebview,
  isSamsungBrowser: isSamsungBrowser
};
