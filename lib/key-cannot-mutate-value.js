'use strict';

var getCurrentSelection = require('./input-selection').get;

module.exports = function (event) {
  var input = event.currentTarget || event.srcElement;
  var selection = getCurrentSelection(input);
  var isAtBeginning = selection.start === 0;
  var isAtEnd = selection.start === input.value.length;
  var isShifted = event.shiftKey === true;

  // https://www.w3.org/TR/DOM-Level-3-Events/#widl-KeyboardEvent-key
  switch (event.key) {
    case undefined: // eslint-disable-line
    case 'Unidentified': // Cannot be determined
    case '':             // Uninitialized
      break;
    case 'Backspace': // backspace at the beginning
      return isAtBeginning;
    case 'Del':    // delete at the end
    case 'Delete':
      return isAtEnd;
    default:
      return event.key.length !== 1;
  }

  // http://unixpapa.com/js/key.html
  switch (event.keyCode) {
    case 9:  // tab
    case 19: // pause/break
    case 20: // caps lock
    case 27: // escape
    case 39: // arrows
    case 45: // insert
      return true;
    case 33: // page up (if shifted, '!')
    case 34: // page down (if shifted, ''')
    case 35: // end (if shifted, '#')
    case 36: // home (if shifted, '$')
    case 37: // arrows (if shifted, '%')
    case 38: // arrows (if shifted, '&')
    case 40: // arrows (if shifted, '(')
      return !isShifted;
    case 8: // backspace at the beginning
      return isAtBeginning;
    case 46: // delete at the end
      return isAtEnd;
    default:
      return false;
  }
};
