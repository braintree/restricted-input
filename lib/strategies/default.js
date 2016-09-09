'use strict';

var keyCannotMutateValue = require('../key-cannot-mutate-value');

function defaultStrategy (self) {
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
  self.inputElement.addEventListener('paste', function (event) {
    self._handlePasteEvent(event);
  });
}

module.exports = defaultStrategy;
