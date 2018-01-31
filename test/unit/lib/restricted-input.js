'use strict';

var RestrictedInput = require('../../../lib/restricted-input');
var BaseStrategy = require('../../../lib/strategies/base');
var IosStrategy = require('../../../lib/strategies/ios');
var IE9Strategy = require('../../../lib/strategies/ie9');
var AndroidChromeStrategy = require('../../../lib/strategies/android-chrome');
var KitKatChromiumBasedWebViewStrategy = require('../../../lib/strategies/kitkat-chromium-based-webview');
var NoopStrategy = require('../../../lib/strategies/noop');
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

    it('uses KitKatChromiumBasedWebViewStrategy for Android KitKiat webvies', function () {
      var ri;

      global.sandbox.stub(device, 'isKitKatWebview').returns(true);

      ri = new RestrictedInput({
        element: document.createElement('input'),
        pattern: '{{a}}'
      });

      expect(ri.strategy).to.be.an.instanceof(KitKatChromiumBasedWebViewStrategy);
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

    it('uses IE9Strategy for IE9 browser', function () {
      var ri;

      global.sandbox.stub(device, 'isIE9').returns(true);

      ri = new RestrictedInput({
        element: document.createElement('input'),
        pattern: '{{a}}'
      });

      expect(ri.strategy).to.be.an.instanceof(IE9Strategy);
    });

    it('uses NoopStrategy for browsers that do not support formatting', function () {
      var ri;

      global.sandbox.stub(device, 'isAndroid').returns(true);
      global.sandbox.stub(device, 'isAndroidChrome').returns(false);

      ri = new RestrictedInput({
        element: document.createElement('input'),
        pattern: '{{a}}'
      });

      expect(ri.strategy).to.be.an.instanceof(NoopStrategy);
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

  describe('supportsFormatting', function () {
    it('returns false if device is an Android phone not using Google Chrome', function () {
      global.sandbox.stub(device, 'isAndroid').returns(true);
      global.sandbox.stub(device, 'isAndroidChrome').returns(false);

      expect(RestrictedInput.supportsFormatting()).to.equal(false);
    });

    it('returns true if device is not a an Android Device', function () {
      global.sandbox.stub(device, 'isAndroid').returns(false);

      expect(RestrictedInput.supportsFormatting()).to.equal(true);
    });

    it('returns true if device is an Android Device running Google Chrome', function () {
      global.sandbox.stub(device, 'isAndroid').returns(true);
      global.sandbox.stub(device, 'isAndroidChrome').returns(true);

      expect(RestrictedInput.supportsFormatting()).to.equal(true);
    });
  });
});
