'use strict';

var RestrictedInput = require('../../../lib/restricted-input');
var BaseStrategy = require('../../../lib/strategies/base');
var IosStrategy = require('../../../lib/strategies/ios');
var AndroidChromeStrategy = require('../../../lib/strategies/android-chrome');
var device = require('../../../lib/device');

describe('RestrictedInput', function () {
  beforeEach(function () {
    global.defaultState = {value: '', caretIndex: 0};
  });

  afterEach(function () {
    global.inputNode = null;
    global.sandbox.restore();
  });

  describe('constructor()', function () {
    it('throws an error if an input or textarea is not provided', function () {
      function fn() {
        return new RestrictedInput({
          element: document.createElement('div'),
          pattern: /^/g
        });
      }

      expect(fn).to.throw('A valid HTML input or textarea element must be provided');
    });

    it('defaults to BaseStrategy', function () {
      var ri = new RestrictedInput({
        element: document.createElement('input'),
        pattern: '{{a}}'
      });

      expect(ri.strategy).to.be.an.instanceof(BaseStrategy);
      expect(ri.strategy).to.not.be.an.instanceof(IosStrategy);
      expect(ri.strategy).to.not.be.an.instanceof(AndroidChromeStrategy);
    });

    it('uses IosStrategy for ios devices', function () {
      var ri;

      global.sandbox.stub(device, 'isIos').returns(true);

      ri = new RestrictedInput({
        element: document.createElement('input'),
        pattern: '{{a}}'
      });

      expect(ri.strategy).to.be.an.instanceof(IosStrategy);
    });

    it('uses AndroidChromeStrategy for android chrome devices', function () {
      var ri;

      global.sandbox.stub(device, 'isAndroidChrome').returns(true);

      ri = new RestrictedInput({
        element: document.createElement('input'),
        pattern: '{{a}}'
      });

      expect(ri.strategy).to.be.an.instanceof(AndroidChromeStrategy);
    });
  });

  describe('getUnformattedValue()', function () {
    it('calls the strategy getUnformattedValue method', function () {
      var ri = new RestrictedInput({
        element: document.createElement('input'),
        pattern: '{{a}}'
      });

      global.sandbox.stub(ri.strategy, 'getUnformattedValue');

      ri.getUnformattedValue();

      expect(ri.strategy.getUnformattedValue).to.be.calledOnce;
    });
  });

  describe('setPattern()', function () {
    it('calls the strategy setPattern method', function () {
      var ri = new RestrictedInput({
        element: document.createElement('input'),
        pattern: '{{a}}'
      });

      global.sandbox.stub(ri.strategy, 'setPattern');

      ri.setPattern('{{1}}');

      expect(ri.strategy.setPattern).to.be.calledOnce;
      expect(ri.strategy.setPattern).to.be.calledWith('{{1}}');
    });
  });
});
