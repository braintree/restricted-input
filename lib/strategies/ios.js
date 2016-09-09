'use strict';

var keyCannotMutateValue = require('../key-cannot-mutate-value');
var getSelection = require('../input-selection').get;
var setSelection = require('../input-selection').set;

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

function createFormatListener (self) {
  return function (event) {
    var formattedState;
    var input = self.inputElement;
    var selection = getSelection(input);
    var stateToFormat = {
      selection: selection,
      value: input.value
    };

    if (self._stateToFormat) {
      stateToFormat = self._stateToFormat;
      delete self._stateToFormat;
    } else if (selection.start === input.value.length) {
      stateToFormat = self.formatter.unformat(stateToFormat);
    }

    formattedState = self.formatter.format(stateToFormat);
    input.value = formattedState.value;
    setSelection(input, formattedState.selection.start, formattedState.selection.end);

    fixLeadingBlankSpaceOnIos(input);
  };
}

function createKeydownListener (self) {
  return function (event) {
    if (keyCannotMutateValue(event)) { return; }
    if (self._isDeletion(event)) {
      self._stateToFormat = self.formatter.simulateDeletion({
        event: event,
        selection: getSelection(self.inputElement),
        value: self.inputElement.value
      });
    }
  };
}

function iOSStategy (self) {
  self.inputElement.addEventListener('keydown', createKeydownListener(self));
  self.inputElement.addEventListener('input', createFormatListener(self));
  self.inputElement.addEventListener('focus', createFormatListener(self));
}

module.exports = iOSStategy;
