'use strict';

var keyCannotMutateValue = require('../key-cannot-mutate-value');
var getSelection = require('../input-selection').get;
var setSelection = require('../input-selection').set;
var isBackspace = require('../is-backspace');
var isDelete = require('../is-delete');
var Formatter = require('../formatter');

function DefaultStrategy(options) {
  this.isFormatted = false;
  this.inputElement = options.element;
  this.formatter = new Formatter(options.pattern);

  this._attachListeners();
}

DefaultStrategy.prototype.getUnformattedValue = function (forceUnformat) {
  var value = this.inputElement.value;

  if (forceUnformat || this.isFormatted) {
    value = this.formatter.unformat({
      value: this.inputElement.value,
      selection: {start: 0, end: 0}
    }).value;
  }

  return value;
};

DefaultStrategy.prototype.setPattern = function (pattern) {
  this._unformatInput();

  this.formatter = new Formatter(pattern);

  this._reformatInput();
};

DefaultStrategy.prototype._attachListeners = function () {
  var self = this;

  self.inputElement.addEventListener('keydown', function (event) {
    if (keyCannotMutateValue(event)) { return; }
    if (self._isDeletion(event)) {
      self._unformatInput(event);
    }
  });
  self.inputElement.addEventListener('keypress', function (event) {
    if (keyCannotMutateValue(event)) { return; }
    self._unformatInput(event);
  });
  self.inputElement.addEventListener('keyup', function (event) {
    self._reformatInput(event);
  });
  self.inputElement.addEventListener('input', function (event) {
    self._reformatInput(event);
  });
  self.inputElement.addEventListener('paste', this.pasteEventHandler.bind(this));
};

DefaultStrategy.prototype._isDeletion = function (event) {
  return isDelete(event) || isBackspace(event);
};

DefaultStrategy.prototype._reformatInput = function () {
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

DefaultStrategy.prototype._unformatInput = function () {
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

DefaultStrategy.prototype._prePasteEventHandler = function (event) {
  // without this, the paste event is called twice
  // so if you were pasting abc it would result in
  // abcabc
  event.preventDefault();
};

DefaultStrategy.prototype._postPasteEventHandler = function (event) {
  this._reformatAfterPaste();
};

DefaultStrategy.prototype.pasteEventHandler = function (event) {
  var selection, splicedEntry;
  var entryValue = '';

  this._prePasteEventHandler(event);

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

  this._postPasteEventHandler();
};

DefaultStrategy.prototype._reformatAfterPaste = function () {
  var event = document.createEvent('Event');

  this._reformatInput();

  event.initEvent('input', true, true);
  this.inputElement.dispatchEvent(event);
};

module.exports = DefaultStrategy;
