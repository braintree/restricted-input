'use strict';

module.exports = function (event) {
  return event.key === 'Backspace' || event.keyCode === 8;
};
