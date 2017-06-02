'use strict';

var keyCannotMutateValue = require('../key-cannot-mutate-value');
var getSelection = require('../input-selection').get;
var setSelection = require('../input-selection').set;
var isBackspace = require('../is-backspace');
var isDelete = require('../is-delete');
var Formatter = require('../formatter');

function BaseStrategy(options) {
  this.isFormatted = false;
  this.inputElement = options.element;
  this.formatter = new Formatter(options.pattern);

  this._attachListeners();
}

function isSimulatedEvent(event) {
  // 1Password sets input.value then fires keyboard events. Dependent on browser
  // here might be falsy values (key = '', keyCode = 0) or these keys might be omitted
  // Chrome autofill inserts keys all at once and fires a single event without key info
  return !event.key && !event.keyCode;
}

BaseStrategy.prototype.getUnformattedValue = function (forceUnformat) {
  var value = this.inputElement.value;

  if (forceUnformat || this.isFormatted) {
    value = this.formatter.unformat({
      value: this.inputElement.value,
      selection: {start: 0, end: 0}
    }).value;
  }

  return value;
};

BaseStrategy.prototype.setPattern = function (pattern) {
  this._unformatInput();

  this.formatter = new Formatter(pattern);

  this._reformatInput();
};

BaseStrategy.prototype._attachListeners = function () {
  var self = this;

  self.inputElement.addEventListener('keydown', function (event) {
    if (isSimulatedEvent(event)) {
      self.isFormatted = false;
    }
    if (keyCannotMutateValue(event)) { return; }
    if (self._isDeletion(event)) {
      self._unformatInput(event);
    }
  });
  self.inputElement.addEventListener('keypress', function (event) {
    if (isSimulatedEvent(event)) {
      self.isFormatted = false;
    }

    if (keyCannotMutateValue(event)) { return; }
    self._unformatInput(event);
  });
  self.inputElement.addEventListener('keyup', function (event) {
    self._reformatInput(event);
  });
  self.inputElement.addEventListener('input', function (event) {
    // Safari AutoFill fires CustomEvents
    // LastPass sends an `isTrusted: false` property
    // Since the input is changed all at once, set isFormatted
    // to false so that reformatting actually occurs
    if (event instanceof CustomEvent || !event.isTrusted) {
      self.isFormatted = false;
    }
    self._reformatInput(event);
  });
  self.inputElement.addEventListener('paste', this._pasteEventHandler.bind(this));
};

BaseStrategy.prototype._isDeletion = function (event) {
  return isDelete(event) || isBackspace(event);
};

BaseStrategy.prototype._reformatInput = function () {
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

  this._afterReformatInput(formattedState);
};

// If a strategy needs to impliment specific behavior
// after reformatting has happend, the strategy just
// overwrites this method on their own prototype
BaseStrategy.prototype._afterReformatInput = function () { };

BaseStrategy.prototype._unformatInput = function () {
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

BaseStrategy.prototype._prePasteEventHandler = function (event) {
  // without this, the paste event is called twice
  // so if you were pasting abc it would result in
  // abcabc
  event.preventDefault();
};

BaseStrategy.prototype._postPasteEventHandler = function () {
  this._reformatAfterPaste();
};

BaseStrategy.prototype._pasteEventHandler = function (event) {
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

BaseStrategy.prototype._reformatAfterPaste = function () {
  var event = document.createEvent('Event');

  this._reformatInput();

  event.initEvent('input', true, true);
  this.inputElement.dispatchEvent(event);
};

BaseStrategy.prototype._getStateToFormat = function () {
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

  return stateToFormat;
};

module.exports = BaseStrategy;
