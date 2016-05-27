'use strict';

var parsePattern = require('./parse-pattern');

function Formatter(pattern) {
  this.setPattern(pattern);
}

Formatter.prototype.setPattern = function (pattern) {
  if (typeof pattern !== 'string') {
    throw new Error('A valid pattern string is required');
  }

  this.pattern = parsePattern(pattern);
};

Formatter.prototype.format = function (options) {
  var i, patternChar, inputChar;
  var originalString = options.value;
  var originalStringIndex = 0;
  var formattedString = '';
  var selection = {
    start: options.selection.start,
    end: options.selection.end
  };

  for (i = 0; i < this.pattern.length; i++) {
    patternChar = this.pattern[i];
    inputChar = originalString[originalStringIndex];

    if (originalStringIndex > originalString.length) { break; }

    if (patternChar.isPermaChar) {
      if (inputChar != null || formattedString.length === patternChar.index) {
        formattedString += patternChar.value;
        if (patternChar.index <= selection.start) { selection.start++; }
        if (patternChar.index <= selection.end) { selection.end++; }
      }
    } else { // User input char
      for (; originalStringIndex < originalString.length; originalStringIndex++) {
        inputChar = originalString[originalStringIndex];

        if (patternChar.value.test(inputChar)) {
          formattedString += inputChar;
          originalStringIndex++;
          break;
        } else {
          if (patternChar.index <= selection.start) { selection.start--; }
          if (patternChar.index <= selection.end) { selection.end--; }
        }
      }
    }
  }

  return {
    value: formattedString,
    selection: selection
  };
};

Formatter.prototype.unformat = function (options) {
  var i, patternChar;
  var start = options.selection.start;
  var end = options.selection.end;
  var unformattedString = '';

  for (i = 0; i < this.pattern.length; i++) {
    patternChar = this.pattern[i];

    if (!patternChar.isPermaChar && options.value[i] != null && patternChar.value.test(options.value[i])) {
      unformattedString += options.value[i];
      continue;
    }

    if (patternChar.value !== options.value[patternChar.index]) { continue; }
    if (patternChar.index < options.selection.start) { start--; }
    if (patternChar.index < options.selection.end) { end--; }
  }

  return {
    selection: {
      start: start,
      end: end
    },
    value: unformattedString
  };
};

module.exports = Formatter;
