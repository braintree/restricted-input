'use strict';

function NoopStrategy(options) {
  this.inputElement = options.element;
}

NoopStrategy.prototype.getUnformattedValue = function () {
  return this.inputElement.value;
};

NoopStrategy.prototype.setPattern = function () {};

NoopStrategy.prototype.pasteEventHandler = function () {};

module.exports = NoopStrategy;
