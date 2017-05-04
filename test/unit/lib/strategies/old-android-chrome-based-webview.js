'use strict';

var AndroidChromeStrategy = require('../../../../lib/strategies/android-chrome');
var OldAndroidChromeBasedWebviewStrategy = require('../../../../lib/strategies/android-chrome');

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
      var strategy = new OldAndroidChromeBasedWebviewStrategy(this.options);

      expect(strategy).to.be.an.instanceof(AndroidChromeStrategy);
    });
  });
});
