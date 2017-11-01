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
  this.inputElement.addEventListener('input', function (event) {
    var isCustomEvent = event instanceof CustomEvent;

    // Safari AutoFill fires CustomEvents
    // Set state to format before calling format listener
    if (isCustomEvent) {
      this._stateToFormat = {
        selection: {start: 0, end: 0},
        value: this.inputElement.value
      };
    }

    this._formatListener();

    if (!isCustomEvent) {
      this._fixLeadingBlankSpaceOnIos();
    }
  }.bind(this));
  this.inputElement.addEventListener('focus', this._formatListener.bind(this));
  this.inputElement.addEventListener('paste', this._pasteEventHandler.bind(this));
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

module.exports = IosStrategy;
