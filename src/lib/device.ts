// server side rendering check
const UA = (typeof window !== "undefined" &&
  window.navigator &&
  window.navigator.userAgent) as string;

// TODO remove this when browser detection is converted to typescript
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import isAndroid = require("@braintree/browser-detection/is-android");
// @ts-ignore
import isChromeOs = require("@braintree/browser-detection/is-chrome-os");
// @ts-ignore
import isChrome = require("@braintree/browser-detection/is-chrome");
// @ts-ignore
import isIos = require("@braintree/browser-detection/is-ios");
// @ts-ignore
import isIE9 = require("@braintree/browser-detection/is-ie9");
/* eslint-enable @typescript-eslint/ban-ts-comment */

// Old Android Webviews used specific versions of Chrome with 0.0.0 as their version suffix
// https://developer.chrome.com/multidevice/user-agent#webview_user_agent
const KITKAT_WEBVIEW_REGEX = /Version\/\d\.\d* Chrome\/\d*\.0\.0\.0/;

function isOldSamsungBrowserOrSamsungWebview(ua: string): boolean {
  return !isChrome(ua) && ua.indexOf("Samsung") > -1;
}

export function isKitKatWebview(ua: string = UA): boolean {
  return isAndroid(ua) && KITKAT_WEBVIEW_REGEX.test(ua);
}

export function isAndroidChrome(ua: string = UA): boolean {
  return (isAndroid(ua) || isChromeOs(ua)) && isChrome(ua);
}

export function isSamsungBrowser(ua: string = UA): boolean {
  return /SamsungBrowser/.test(ua) || isOldSamsungBrowserOrSamsungWebview(ua);
}

export { isIE9, isIos };
