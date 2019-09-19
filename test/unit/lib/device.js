'use strict';
/* eslint-disable camelcase */

var device = require('../../../lib/device');
var AGENTS = {
  androidOperaMini: 'Opera/9.80 (Android; Opera Mini/7.6.35766/35.5706; U; en) Presto/2.8.119 Version/11.10',
  androidPhoneChrome: 'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19',
  androidPhoneFirefox: 'Mozilla/5.0 (Android; Mobile; rv:40.0) Gecko/40.0 Firefox/40.0',
  androidTabletFirefox: 'Mozilla/5.0 (Android; Tablet; rv:40.0) Gecko/40.0 Firefox/40.0',
  androidWebviewOld: 'Mozilla/5.0 (Linux; U; Android 4.1.1; en-gb; Build/KLP) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30',
  androidWebviewKitKatLollipop: 'Mozilla/5.0 (Linux; Android 4.4; Nexus 5 Build/_BuildID_) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36',
  androidWebviewLollipopAndAbove: 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 5 Build/LMY48B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/43.0.2357.65 Mobile Safari/537.36',
  chromeOsChrome: 'Mozilla/5.0 (X11; CrOS x86_64 12105.100.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.144 Safari/537.36',
  ie7: 'Mozilla/4.0(compatible; MSIE 7.0b; Windows NT 6.0)',
  ie8: 'Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; GTB7.4; InfoPath.2; SV1; .NET CLR 3.3.69573; WOW64; en-US)',
  ie9: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)',
  ie10: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)',
  ie11: 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko',
  iPad3_2Safari: 'Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.10',
  iPad5_1Safari: 'Mozilla/5.0 (iPad; U; CPU OS 5_1 like Mac OS X) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B367 Safari/531.21.10',
  iPad9_3Safari: 'Mozilla/5.0 (iPad; CPU OS 9_3 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13e230 Safari/601.1',
  iPadWebview: 'Mozilla/5.0 (iPad; CPU OS 5_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/98176',
  iPodSafari: 'Mozilla/5.0 (iPod; U; CPU like Mac OS X; en) AppleWebKit/420.1 (KHTML, like Gecko) Version/3.0 Mobile/3A101a Safari/419.3',
  iPodWebview: 'Mozilla/5.0 (iPod; CPU OS 5_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/3A101a',
  iPhone_3_2Safari: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B314 Safari/531.21.10',
  iPhone_9_3_1Safari: 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_3 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13E230 Safari/601.1',
  iPhoneChrome: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 5_1_1 like Mac OS X; en) AppleWebKit/534.46.0 (KHTML, like Gecko) CriOS/19.0.1084.60 Mobile/9B206 Safari/7534.48.3',
  iPhoneFirefox: 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) FxiOS/1.0 Mobile/12F69 Safari/600.1.4',
  iPhoneWebview: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_1 like Mac OS X; en-us) AppleWebKit/532.9 (KHTML, like Gecko) Mobile/8B117',
  iPhoneGoogleSearchAppWebview: 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_2 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) GSA/16.0.124986583 Mobile/13F69 Safari/600.1.4',
  linuxFirefox: 'Mozilla/5.0 (Maemo; Linux armv7l; rv:10.0) Gecko/20100101 Firefox/10.0 Fennec/10.0',
  linuxOpera: 'Opera/9.80 (X11; Linux i686; Ubuntu/14.10) Presto/2.12.388 Version/12.16',
  macSafari7_0_2: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.74.9 (KHTML, like Gecko) Version/7.0.2 Safari/537.74.9',
  macFirefox: 'Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:10.0) Gecko/20100101 Firefox/10.0',
  pcChrome_27: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.93 Safari/537.36',
  pcChrome_41: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
  pcFirefox: 'Mozilla/5.0 (Windows NT x.y; Win64; x64; rv:10.0) Gecko/20100101 Firefox/10.0',
  pcSafari5_1: 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50',
  samsungBrowserWebview: 'Mozilla/5.0 (Linux; U; Android 4.2.2; en-us; Samsung Galaxy Note 2 - 4.2.2 - API 17 - 720x1280 Build/JDQ39E) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
  samsungAndroidChrome: 'Mozilla/5.0 (Linux; Android 4.2.2; Samsung Galaxy Note 2 - 4.2.2 - API 17 - 720x1280 Build/JDQ39E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.91 Mobile Safari/537.36',
  samsungBrowser2_1: 'Mozilla/5.0 (Linux; Android 5.0.1; SAMSUNG SPH-L720T Build/LRX22C) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/2.1 Chrome/34.0.1847.76 Mobile Safari/537.36'
};

describe('device', function () {
  describe('isAndroidChrome()', function () {
    it('returns true if user agent is Chrome for Android', function () {
      expect(device.isAndroidChrome(AGENTS.androidPhoneChrome)).to.equal(true);
    });

    it('returns false for Chrome desktop', function () {
      expect(device.isAndroidChrome(AGENTS.pcChrome_27)).to.equal(false);
      expect(device.isAndroidChrome(AGENTS.pcChrome_41)).to.equal(false);
      expect(device.isAndroidChrome(AGENTS.iPhoneChrome)).to.equal(false);
    });

    it('returns true for ChromeOS Chrome', function () {
      expect(device.isAndroidChrome(AGENTS.chromeOsChrome)).to.equal(true);
    });
  });

  describe('isIos', function () {
    it('returns true for an iPad', function () {
      expect(device.isIos(AGENTS.iPad3_2Safari)).to.equal(true);
      expect(device.isIos(AGENTS.iPad5_1Safari)).to.equal(true);
      expect(device.isIos(AGENTS.iPad9_3Safari)).to.equal(true);
    });

    it('returns true for an iPod', function () {
      expect(device.isIos(AGENTS.iPodSafari)).to.equal(true);
    });

    it('returns true for an iPhone', function () {
      expect(device.isIos(AGENTS.iPhone_3_2Safari)).to.equal(true);
      expect(device.isIos(AGENTS.iPhone_9_3_1Safari)).to.equal(true);
    });

    it('returns true for iOS Chrome', function () {
      expect(device.isIos(AGENTS.iPhoneChrome)).to.equal(true);
    });

    it('returns false for non-iOS browsers', function () {
      var key, ua;

      for (key in AGENTS) {
        if (!AGENTS.hasOwnProperty(key)) {
          continue;
        }
        if (!/iPhone|iPad|iPod/.test(key)) {
          ua = AGENTS[key];
          expect(device.isIos(ua)).to.be.false;
        }
      }
    });
  });

  describe('isKitKatWebview()', function () {
    it('returns true if user agent is Android 4 Webview with Chrome in useragent', function () {
      expect(device.isKitKatWebview(AGENTS.androidWebviewKitKatLollipop)).to.equal(true);
    });

    it('returns false for Android webviews without chrome in user agent', function () {
      expect(device.isKitKatWebview(AGENTS.androidWebviewOld)).to.equal(false);
    });

    it('returns false for Android webviews with newer builds of Chrome', function () {
      expect(device.isKitKatWebview(AGENTS.androidWebviewLollipopAndAbove)).to.equal(false);
    });

    it('returns false for Android Chrome', function () {
      expect(device.isKitKatWebview(AGENTS.androidPhoneChrome)).to.equal(false);
    });
  });

  describe('isIE9', function () {
    it('returns true for IE9', function () {
      expect(device.isIE9(AGENTS.ie9)).to.equal(true);
    });

    it('returns false for non-IE9', function () {
      expect(device.isIE9(AGENTS.ie10)).to.equal(false);
      expect(device.isIE9(AGENTS.ie11)).to.equal(false);
    });
  });

  describe('isSamsungBrowser', function () {
    it('returns true for current Samsung Browser', function () {
      expect(device.isSamsungBrowser(AGENTS.samsungBrowser2_1)).to.equal(true);
    });

    it('returns true for old Samsung Browser and webviews', function () {
      expect(device.isSamsungBrowser(AGENTS.samsungBrowserWebview)).to.equal(true);
    });

    it('returns false when not Samsung Browser', function () {
      var key, ua;

      for (key in AGENTS) {
        if (!AGENTS.hasOwnProperty(key)) {
          continue;
        }
        if (!/samsungBrowser/.test(key)) {
          ua = AGENTS[key];
          expect(device.isSamsungBrowser(ua)).to.be.false;
        }
      }
    });
  });
});
