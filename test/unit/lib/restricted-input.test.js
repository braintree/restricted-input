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
  });

  describe('constructor()', function () {
    it('throws an error if an input or textarea is not provided', function () {
      function fn() {
        return new RestrictedInput({
          element: document.createElement('div'),
          pattern: /^/g
        });
      }

      expect(fn).toThrowError('A valid HTML input or textarea element must be provided');
    });

    it('defaults to BaseStrategy', function () {
      var ri = new RestrictedInput({
        element: document.createElement('input'),
        pattern: '{{a}}'
      });

      expect(ri.strategy).toBeInstanceOf(BaseStrategy);
      expect(ri.strategy).not.toBeInstanceOf(IosStrategy);
      expect(ri.strategy).not.toBeInstanceOf(AndroidChromeStrategy);
    });

    it('sets isFormatted to `true` on initialization if input element has a value', function () {
      var element = document.createElement('input');
      var ri;

      element.value = '41111111';
      ri = new RestrictedInput({
        element: element,
        pattern: '{{9999}} {{9999}}'
      });

      expect(ri.strategy.inputElement.value).toBe('4111 1111');
      expect(ri.strategy.isFormatted).toBe(true);
    });

    it('sets isFormatted to `false` on initialization if input element has no value', function () {
      var element = document.createElement('input');
      var ri;

      element.value = '';
      ri = new RestrictedInput({
        element: element,
        pattern: '{{9999}} {{9999}}'
      });

      expect(ri.strategy.inputElement.value).toBe('');
      expect(ri.strategy.isFormatted).toBe(false);
    });

    it('uses IosStrategy for ios devices', function () {
      var ri;

      jest.spyOn(device, 'isIos').mockReturnValue(true);

      ri = new RestrictedInput({
        element: document.createElement('input'),
        pattern: '{{a}}'
      });

      expect(ri.strategy).toBeInstanceOf(IosStrategy);
    });

    it('uses KitKatChromiumBasedWebViewStrategy for Android KitKiat webvies', function () {
      var ri;

      jest.spyOn(device, 'isKitKatWebview').mockReturnValue(true);

      ri = new RestrictedInput({
        element: document.createElement('input'),
        pattern: '{{a}}'
      });

      expect(ri.strategy).toBeInstanceOf(KitKatChromiumBasedWebViewStrategy);
    });

    it('uses AndroidChromeStrategy for android chrome devices', function () {
      var ri;

      jest.spyOn(device, 'isAndroidChrome').mockReturnValue(true);

      ri = new RestrictedInput({
        element: document.createElement('input'),
        pattern: '{{a}}'
      });

      expect(ri.strategy).toBeInstanceOf(AndroidChromeStrategy);
    });

    it('uses IE9Strategy for IE9 browser', function () {
      var ri;

      jest.spyOn(device, 'isIE9').mockReturnValue(true);

      ri = new RestrictedInput({
        element: document.createElement('input'),
        pattern: '{{a}}'
      });

      expect(ri.strategy).toBeInstanceOf(IE9Strategy);
    });

    it('uses NoopStrategy for Samsung browser', function () {
      var ri;

      jest.spyOn(device, 'isSamsungBrowser').mockReturnValue(true);

      ri = new RestrictedInput({
        element: document.createElement('input'),
        pattern: '{{a}}'
      });

      expect(ri.strategy).toBeInstanceOf(NoopStrategy);
    });
  });

  describe('getUnformattedValue()', function () {
    it('calls the strategy getUnformattedValue method', function () {
      var ri = new RestrictedInput({
        element: document.createElement('input'),
        pattern: '{{a}}'
      });

      jest.spyOn(ri.strategy, 'getUnformattedValue');

      ri.getUnformattedValue();

      expect(ri.strategy.getUnformattedValue).toBeCalledTimes(1);
    });
  });

  describe('setPattern()', function () {
    it('calls the strategy setPattern method', function () {
      var ri = new RestrictedInput({
        element: document.createElement('input'),
        pattern: '{{a}}'
      });

      jest.spyOn(ri.strategy, 'setPattern');

      ri.setPattern('{{1}}');

      expect(ri.strategy.setPattern).toBeCalledTimes(1);
      expect(ri.strategy.setPattern).toBeCalledWith('{{1}}');
    });
  });

  describe('supportsFormatting', function () {
    it('returns false if device is a samsung browser', function () {
      jest.spyOn(device, 'isSamsungBrowser').mockReturnValue(true);

      expect(RestrictedInput.supportsFormatting()).toBe(false);
    });

    it('returns true if device is not a Samsung browser', function () {
      jest.spyOn(device, 'isSamsungBrowser').mockReturnValue(false);

      expect(RestrictedInput.supportsFormatting()).toBe(true);
    });
  });
});
