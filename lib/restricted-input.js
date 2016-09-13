'use strict';

var isAndroidChrome = require('./device').isAndroidChrome;
var isIos = require('./device').isIos;
var constants = require('./constants');
var isValidElement = require('./is-valid-element');
var IosStrategy = require('./strategies/ios');
var AndroidChromeStrategy = require('./strategies/android-chrome');
var DefaultStrategy = require('./strategies/default');

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

  if (isIos()) {
    this.strategy = new IosStrategy(options);
  } else if (isAndroidChrome()) {
    this.strategy = new AndroidChromeStrategy(options);
  } else {
    this.strategy = new DefaultStrategy(options);
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

module.exports = RestrictedInput;
