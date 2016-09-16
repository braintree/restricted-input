'use strict';

var AndroidChromeStrategy = require('../../../../lib/strategies/android-chrome');
var BaseStrategy = require('../../../../lib/strategies/base');

describe('Android Chrome Strategy', function () {
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
    it('is an instance of BaseStrategy', function () {
      var strategy = new AndroidChromeStrategy(this.options);

      expect(strategy).to.be.an.instanceof(BaseStrategy);
    });
  });
});
