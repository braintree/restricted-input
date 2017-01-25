'use strict';

var BaseStrategy = require('./base');
var keyCannotMutateValue = require('../key-cannot-mutate-value');
var getSelection = require('../input-selection').get;
var setSelection = require('../input-selection').set;

function IE9Strategy(options) {
  BaseStrategy.call(this, options);
}

IE9Strategy.prototype = Object.create(BaseStrategy.prototype);
IE9Strategy.prototype.constructor = IE9Strategy;

IE9Strategy.prototype.getUnformattedValue = function () {
  return BaseStrategy.prototype.getUnformattedValue.call(this, true);
};

IE9Strategy.prototype._attachListeners = function () {
  this.inputElement.addEventListener('keydown', this._keydownListener.bind(this));
  this.inputElement.addEventListener('focus', this._format.bind(this));
  this.inputElement.addEventListener('paste', this._pasteEventHandler.bind(this));
};

IE9Strategy.prototype._format = function () {
  var input = this.inputElement;
  var stateToFormat = this._getStateToFormat();
  var formattedState = this.formatter.format(stateToFormat);

  input.value = formattedState.value;
  setSelection(input, formattedState.selection.start, formattedState.selection.end);
};

IE9Strategy.prototype._keydownListener = function (event) {
  var newValue, oldValue, selection;

  if (keyCannotMutateValue(event)) { return; }

  event.preventDefault();

  if (this._isDeletion(event)) {
    this._stateToFormat = this.formatter.simulateDeletion({
      event: event,
      selection: getSelection(this.inputElement),
      value: this.inputElement.value
    });
  } else {
    // IE9 does not update the input's value attribute
    // during key events, only after they complete.
    // We must retrieve the key from event.key and
    // add it to the input's value before formatting.
    oldValue = this.inputElement.value;
    selection = getSelection(this.inputElement);
    newValue = oldValue.slice(0, selection.start) + event.key + oldValue.slice(selection.start);
    selection = padSelection(selection, 1);

    this._stateToFormat = {
      selection: selection,
      value: newValue
    };
    if (selection.start === newValue.length) {
      this._stateToFormat = this.formatter.unformat(this._stateToFormat);
    }
  }

  this._format();
};

IE9Strategy.prototype._reformatAfterPaste = function () {
  var input = this.inputElement;
  var selection = getSelection(this.inputElement);
  var value = this.formatter.format({
    selection: selection,
    value: input.value
  }).value;

  selection = padSelection(selection, 1);
  input.value = value;
  // IE9 sets the selection to the end of the input
  // manually setting it in a setTimeout puts it
  // in the correct position after pasting
  setTimeout(function () {
    setSelection(input, selection.start, selection.end);
  }, 0);
};

function padSelection(selection, pad) {
  return {
    start: selection.start + pad,
    end: selection.end + pad
  };
}

module.exports = IE9Strategy;
