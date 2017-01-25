'use strict';

var keyCannotMutateValue = require('../key-cannot-mutate-value');
var BaseStrategy = require('./base');
var setSelection = require('../input-selection').set;

function AndroidChromeStrategy(options) {
  BaseStrategy.call(this, options);
}

AndroidChromeStrategy.prototype = Object.create(BaseStrategy.prototype);
AndroidChromeStrategy.prototype.constructor = AndroidChromeStrategy;

AndroidChromeStrategy.prototype._attachListeners = function () {
  var self = this;

  self.inputElement.addEventListener('keydown', function (event) {
    if (keyCannotMutateValue(event)) { return; }
    self._unformatInput(event);
  });

  // 'keypress' is not fired with some Android keyboards (see #23)
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

  self.inputElement.addEventListener('paste', this._pasteEventHandler.bind(this));
};

AndroidChromeStrategy.prototype._prePasteEventHandler = function () {
  // the default strategy calls preventDefault here
  // but that removes the clipboard data in Android chrome
  // so we noop instead
};

AndroidChromeStrategy.prototype._postPasteEventHandler = function () {
  // the default strategy calls this without a timeout
  setTimeout(this._reformatAfterPaste.bind(this), 0);
};

AndroidChromeStrategy.prototype._afterReformatInput = function (formattedState) {
  var input = this.inputElement;

  // Some Android Chrome keyboards (notably Samsung)
  // cause the browser to not know that the value
  // of the input has changed when adding
  // permacharacters. This results in the selection
  // putting the cursor before the permacharacter,
  // instead of after.
  //
  // There is also the case of some Android Chrome
  // keyboards reporting a ranged selection on the
  // first character input. Restricted Input maintains
  // that range even though it is incorrect from the
  // keyboard.
  //
  // To resolve these issues we setTimeout and reset
  // the selection to the formatted end position.
  setTimeout(function () {
    var formattedSelection = formattedState.selection;

    setSelection(input, formattedSelection.end, formattedSelection.end);
  }, 0);
};

module.exports = AndroidChromeStrategy;
