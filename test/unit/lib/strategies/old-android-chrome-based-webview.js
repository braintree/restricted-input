'use strict';

var AndroidChromeStrategy = require('../../../../lib/strategies/android-chrome');
var KitKatChromiumBasedWebViewStrategy = require('../../../../lib/strategies/kitkat-chromium-based-webview');

describe('Old Android Chrome Based Webview Strategy', function () {
  beforeEach(function () {
    this.options = {
      element: {
        value: 'input value',
        addEventListener: global.sandbox.stub()
      },
      pattern: '{{9}}'
    };
  });

  describe('constructor()', function () {
    it('is an instance of AndroidChromeStrategy', function () {
      var strategy = new KitKatChromiumBasedWebViewStrategy(this.options);

      expect(strategy).to.be.an.instanceof(AndroidChromeStrategy);
    });
  });
});
