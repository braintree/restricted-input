'use strict';

var AndroidChromeStrategy = require('../../../../lib/strategies/android-chrome');
var BaseStrategy = require('../../../../lib/strategies/base');

describe('Android Chrome Strategy', function () {
  describe('constructor()', function () {
    it('is an instance of BaseStrategy', function () {
      var options = {
        element: {
          value: 'input value',
          addEventListener: jest.fn()
        },
        pattern: '{{9}}'
      };
      var strategy = new AndroidChromeStrategy(options);

      expect(strategy).toBeInstanceOf(BaseStrategy);
    });
  });
});
