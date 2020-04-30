'use strict';

var AndroidChromeStrategy = require('../../../../lib/strategies/android-chrome');
var KitKatChromiumBasedWebViewStrategy = require('../../../../lib/strategies/kitkat-chromium-based-webview');

describe('Old Android Chrome Based Webview Strategy', function () {
  describe('constructor()', function () {
    it('is an instance of AndroidChromeStrategy', function () {
      var options = {
        element: {
          value: 'input value',
          addEventListener: jest.fn()
        },
        pattern: '{{9}}'
      };
      var strategy = new KitKatChromiumBasedWebViewStrategy(options);

      expect(strategy).toBeInstanceOf(AndroidChromeStrategy);
    });
  });
});
