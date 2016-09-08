'use strict';

var isAndroidChrome = require('./device').isAndroidChrome;
var getSelection = require('./input-selection').get;
var setSelection = require('./input-selection').set;
var keyCannotMutateValue = require('./key-cannot-mutate-value');
var constants = require('./constants');
var isValidElement = require('./is-valid-element');
var Formatter = require('./formatter');
var DELETE_REGEX = /^(Del|Delete)$/;

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

  this.isFormatted = false;
  this.inputElement = element;
  this.pattern = pattern;
  this.formatter = new Formatter(pattern);

  this._attachEvents();
}

/**
 * @public
 * @returns {string} the unformatted value of the element
 */
RestrictedInput.prototype.getUnformattedValue = function () {
  var value = this.inputElement.value;

  if (this.isFormatted) {
    value = this.formatter.unformat({
      value: this.inputElement.value,
      selection: {start: 0, end: 0}
    }).value;
  }

  return value;
};

/**
 * @public
 * @param {string} pattern - the pattern to enforce on the element
 * @return {void}
 */
RestrictedInput.prototype.setPattern = function (pattern) {
  this._unformatInput();

  this.pattern = pattern;
  this.formatter = new Formatter(pattern);

  this._reformatInput();
};

RestrictedInput.prototype._attachEvents = function () {
  var self = this;

  this._inputListener = function (event) {
    self._reformatInput(event);
  };
  this._keyupListener = function (event) {
    self._reformatInput(event);
  };
  this._keydownListener = function (event) {
    if (keyCannotMutateValue(event)) { return; }
    if (self._isDeletion(event)) {
      self._unformatInput(event);
    }
  };
  this._keypressListener = function (event) {
    if (keyCannotMutateValue(event)) { return; }
    self._unformatInput(event);
  };
  this._pasteListener = function (event) {
    self._handlePasteEvent(event);
  };

  this.inputElement.addEventListener('keydown', this._keydownListener);
  this.inputElement.addEventListener('keypress', this._keypressListener);
  this.inputElement.addEventListener('keyup', this._keyupListener);
  this.inputElement.addEventListener('input', this._inputListener);
  this.inputElement.addEventListener('paste', this._pasteListener);
};

RestrictedInput.prototype._isDeletion = function (event) {
  var isBackspace = event.key === 'Backspace' || event.keyCode === 8;
  var isDelete = DELETE_REGEX.test(event.key) || event.keyCode === 46;

  return isDelete || isBackspace;
};

RestrictedInput.prototype._reformatInput = function () {
  var input, formattedState;

  if (this.isFormatted) { return; }

  this.isFormatted = true;
  input = this.inputElement;
  formattedState = this.formatter.format({
    selection: getSelection(input),
    value: input.value
  });

  input.value = formattedState.value;
  setSelection(input, formattedState.selection.start, formattedState.selection.end);
};

RestrictedInput.prototype._unformatInput = function () {
  var input, unformattedState, selection;

  if (!this.isFormatted) { return; }

  this.isFormatted = false;
  input = this.inputElement;
  selection = getSelection(input);

  unformattedState = this.formatter.unformat({
    selection: selection,
    value: input.value
  });

  input.value = unformattedState.value;
  setSelection(input, unformattedState.selection.start, unformattedState.selection.end);
};

RestrictedInput.prototype._handlePasteEvent = function (event) {
  var selection, splicedEntry;
  var entryValue = '';

  if (!isAndroidChrome()) {
    event.preventDefault();
  }

  this._unformatInput();

  if (event.clipboardData) {
    entryValue = event.clipboardData.getData('Text');
  } else if (global.clipboardData) {
    entryValue = global.clipboardData.getData('Text');
  }

  selection = getSelection(this.inputElement);
  splicedEntry = this.inputElement.value.split('');

  splicedEntry.splice(selection.start, selection.end - selection.start, entryValue);
  splicedEntry = splicedEntry.join('');

  this.inputElement.value = splicedEntry;
  setSelection(this.inputElement, selection.start + entryValue.length, selection.start + entryValue.length);

  // If you use preventDefault() in chrome's android, the paste text is empty
  if (isAndroidChrome()) {
    setTimeout(this._reformatAfterPaste.bind(this), 0);
  } else {
    this._reformatAfterPaste();
  }
};

RestrictedInput.prototype._reformatAfterPaste = function () {
  var event = document.createEvent('Event');

  this._reformatInput();

  event.initEvent('input', true, true);
  this.inputElement.dispatchEvent(event);
};

module.exports = RestrictedInput;
