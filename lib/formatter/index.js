'use strict';

var parsePattern = require('./parse-pattern');
var isBackspace = require('../is-backspace');

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
  var value = options.value;
  var formatCompensation = 0;

  function isPatternChar(index) {
    var valueWithFormatCompensation = getValueWithFormatCompensation(index);

    return !patternChar.isPermaChar && valueWithFormatCompensation != null && patternChar.value.test(valueWithFormatCompensation);
  }

  function getValueWithFormatCompensation(index) {
    return value[index - formatCompensation];
  }

  for (i = 0; i < this.pattern.length; i++) {
    patternChar = this.pattern[i];

    if (isPatternChar(i)) {
      unformattedString += getValueWithFormatCompensation(i);
      continue;
    }

    if (patternChar.value !== value[patternChar.index]) {
      formatCompensation++;
      continue;
    }
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

Formatter.prototype.simulateDeletion = function (options) {
  var deletionStart, deletionEnd;
  var state = this.unformat.apply(this, arguments);
  var value = state.value;
  var selection = state.selection;
  var delta = Math.abs(state.selection.end - state.selection.start);

  if (delta) {
    deletionStart = selection.start;
    deletionEnd = selection.end;
  } else if (isBackspace(options.event)) {
    deletionStart = Math.max(0, selection.start - 1);
    deletionEnd = selection.start;
  } else { // Handle forward delete
    deletionStart = selection.start;
    deletionEnd = Math.min(value.length, selection.start + 1);
  }

  return {
    selection: {
      start: deletionStart,
      end: deletionStart
    },
    value: value.substr(0, deletionStart) + value.substr(deletionEnd)
  };
};

module.exports = Formatter;
