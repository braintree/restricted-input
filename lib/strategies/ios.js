'use strict';

var BaseStrategy = require('./base');
var keyCannotMutateValue = require('../key-cannot-mutate-value');
var getSelection = require('../input-selection').get;
var setSelection = require('../input-selection').set;

function IosStrategy(options) {
  BaseStrategy.call(this, options);
}

IosStrategy.prototype = Object.create(BaseStrategy.prototype);
IosStrategy.prototype.constructor = IosStrategy;

IosStrategy.prototype.getUnformattedValue = function () {
  return BaseStrategy.prototype.getUnformattedValue.call(this, true);
};

IosStrategy.prototype._attachListeners = function () {
  this.inputElement.addEventListener('keydown', this._keydownListener.bind(this));
  this.inputElement.addEventListener('input', this._formatListener.bind(this));
  this.inputElement.addEventListener('focus', this._formatListener.bind(this));
};

// When deleting the last character on iOS, the cursor
// is positioned as if there is a blank space when there
// is not, setting it to '' in a setTimeout fixes it ¯\_(ツ)_/¯
IosStrategy.prototype._fixLeadingBlankSpaceOnIos = function () {
  var input = this.inputElement;

  if (input.value === '') {
    setTimeout(function () {
      input.value = '';
    }, 0);
  }
};

IosStrategy.prototype._formatListener = function () {
  var input = this.inputElement;
  var stateToFormat = this._getStateToFormat();
  var formattedState = this.formatter.format(stateToFormat);

  input.value = formattedState.value;
  setSelection(input, formattedState.selection.start, formattedState.selection.end);

  this._fixLeadingBlankSpaceOnIos();
};

IosStrategy.prototype._keydownListener = function (event) {
  if (keyCannotMutateValue(event)) { return; }
  if (this._isDeletion(event)) {
    this._stateToFormat = this.formatter.simulateDeletion({
      event: event,
      selection: getSelection(this.inputElement),
      value: this.inputElement.value
    });
  }
};

IosStrategy.prototype._getStateToFormat = function () {
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

module.exports = IosStrategy;
