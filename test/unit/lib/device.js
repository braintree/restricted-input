'use strict';

var device = require('../../../lib/device');

describe('device', function () {
  describe('isAndroidChrome()', function () {
    it('returns true if user agent is Chrome for Android', function () {
      var ua = 'browser Chrome on Android';

      expect(device.isAndroidChrome(ua)).to.equal(true);
    });

    it('returns false for Chrome desktop', function () {
      var ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.130 Safari/537.36';

      expect(device.isAndroidChrome(ua)).to.equal(false);
    });

    it('returns false for IE9', function () {
      var ua = 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 7.1; Trident/5.0)';

      expect(device.isAndroidChrome(ua)).to.equal(false);
    });
  });
});
