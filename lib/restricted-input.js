'use strict';

var device = require('./device');
var supportsInputFormatting = require('../supports-input-formatting');
var constants = require('./constants');
var isValidElement = require('./is-valid-element');
var IosStrategy = require('./strategies/ios');
var AndroidChromeStrategy = require('./strategies/android-chrome');
var KitKatChromiumBasedWebViewStrategy = require('./strategies/kitkat-chromium-based-webview');
var IE9Strategy = require('./strategies/ie9');
var BaseStrategy = require('./strategies/base');
var NoopStrategy = require('./strategies/noop');

/**
 * Instances of this class can be used to modify the formatter for an input
 * @class
 * @param {object} options The initialization paramaters for this class
 * @param {object} options.element - A Input DOM object that RestrictedInput operates on
 * @param {string} options.pattern - The pattern to enforce on this element
 */
function RestrictedInput(options) {
  options = options || {};

  if (!isValidElement(options.element)) {
    throw new Error(constants.errors.INVALID_ELEMENT);
  }

  if (!options.pattern) {
    throw new Error(constants.errors.PATTERN_MISSING);
  }

  if (!RestrictedInput.supportsFormatting()) {
    this.strategy = new NoopStrategy(options);
  } else if (device.isIos()) {
    this.strategy = new IosStrategy(options);
  } else if (device.isKitKatWebview()) {
    this.strategy = new KitKatChromiumBasedWebViewStrategy(options);
  } else if (device.isAndroidChrome()) {
    this.strategy = new AndroidChromeStrategy(options);
  } else if (device.isIE9()) {
    this.strategy = new IE9Strategy(options);
  } else {
    this.strategy = new BaseStrategy(options);
  }
}

/**
 * @public
 * @returns {string} the unformatted value of the element
 */
RestrictedInput.prototype.getUnformattedValue = function () {
  return this.strategy.getUnformattedValue();
};

/**
 * @public
 * @param {string} pattern - the pattern to enforce on the element
 * @return {void}
 */
RestrictedInput.prototype.setPattern = function (pattern) {
  this.strategy.setPattern(pattern);
};

RestrictedInput.supportsFormatting = function () {
  return supportsInputFormatting();
};

module.exports = RestrictedInput;
