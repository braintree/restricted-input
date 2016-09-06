'use strict';

var isAndroid = require('./device').isAndroid;
var getSelection = require('./input-selection').get;
var setSelection = require('./input-selection').set;
var keyCannotMutateValue = require('./key-cannot-mutate-value');
var constants = require('./constants');
var isValidElement = require('./is-valid-element');
var Formatter = require('./formatter');
var isBackspace = require('./is-backspace');
var isDelete = require('./is-delete');
var IE_9_REGEX = /MSIE 9/;

/**
 * Instances of this class can be used to modify the formatter for an input
 * @class
 * @param {object} options The initialization paramaters for this class
 * @param {object} options.element - A Input DOM object that RestrictedInput operates on
 * @param {string} options.pattern - The pattern to enforce on this element
 */
function RestrictedInput(options) {
  var element, pattern;

  options = options || {};
  element = options.element;
  pattern = options.pattern;

  if (!isValidElement(element)) {
    throw new Error(constants.errors.INVALID_ELEMENT);
  }

  if (!pattern) {
    throw new Error(constants.errors.PATTERN_MISSING);
  }

  this.inputElement = element;
  this.pattern = pattern;
  this.formatter = new Formatter(pattern);

  if (!isAndroid()) {
    this._attachEvents();
  }
}

/**
 * @public
 * @returns {string} the unformatted value of the element
 */
RestrictedInput.prototype.getUnformattedValue = function () {
  return this.formatter.unformat({
    value: this.inputElement.value,
    selection: {start: 0, end: 0}
  }).value;
};

/**
 * @public
 * @param {string} pattern - the pattern to enforce on the element
 * @return {void}
 */
RestrictedInput.prototype.setPattern = function (pattern) {
  var input = this.inputElement;

  this._unformatInput();

  this.pattern = pattern;
  this.formatter = new Formatter(pattern);
  this._stateToFormat = {
    selection: getSelection(input),
    value: input.value
  };

  this._reformatInput();
};

RestrictedInput.prototype._attachEvents = function () {
  var self = this;

  this.inputElement.addEventListener('keydown', function (event) {
    if (keyCannotMutateValue(event)) { return; }
    if (self._isDeletion(event)) {
      self._stateToFormat = self.formatter.simulateDeletion({
        event: event,
        selection: getSelection(self.inputElement),
        value: self.inputElement.value
      });
    }
  });

  // TODO: improve this isIE9 logic
  if (IE_9_REGEX.test(navigator.userAgent)) {
    this.inputElement.addEventListener('keyup', this._reformatInput.bind(this));
  } else {
    this.inputElement.addEventListener('input', this._reformatInput.bind(this));
  }

  this.inputElement.addEventListener('focus', this._reformatInput.bind(this));
};

RestrictedInput.prototype._isDeletion = function (event) {
  return isDelete(event) || isBackspace(event);
};

RestrictedInput.prototype._reformatInput = function () {
  var formattedState;
  var input = this.inputElement;
  var selection = getSelection(input);
  var stateToFormat = {
    selection: selection,
    value: input.value
  };

  if (this._stateToFormat) {
    stateToFormat = this._stateToFormat;
    delete this._stateToFormat;
  } else if (selection.start === input.value.length) {
    stateToFormat = this.formatter.unformat(stateToFormat);
  }

  formattedState = this.formatter.format(stateToFormat);

  input.value = formattedState.value;
  setSelection(input, formattedState.selection.start, formattedState.selection.end);

  fixLeadingBlankSpaceOnIos(input);
};

RestrictedInput.prototype._unformatInput = function () {
  var input = this.inputElement;
  var unformattedState = this.formatter.unformat({
    selection: getSelection(input),
    value: input.value
  });

  input.value = unformattedState.value;
  setSelection(input, unformattedState.selection.start, unformattedState.selection.end);
};

// When deleting the last character on iOS, the cursor is positioned
// as if there is a blank space when there is not, setting it to ''
// in a setTimeout fixes it ¯\_(ツ)_/¯
function fixLeadingBlankSpaceOnIos(input) {
  if (input.value === '') {
    setTimeout(function () {
      input.value = '';
    }, 0);
  }
}

module.exports = RestrictedInput;
