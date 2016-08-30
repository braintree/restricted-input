'use strict';

var ALPHA_REGEX = /[A-Za-z]/;
var DIGIT_REGEX = /\d/;
var WILD_REGEX = /./;
var PLACEHOLDER_REGEX = /^[A-Za-z0-9\*]$/;
var PLACEHOLDER_PATTERN = '({{[^}]+}})';
var PERMACHAR_REGEX = '(\\s|\\S)';
var PATTERN_REGEX = new RegExp(PLACEHOLDER_PATTERN + '|' + PERMACHAR_REGEX, 'g');
var PLACEHOLDER_PATTERN_REGEX = new RegExp('^' + PLACEHOLDER_PATTERN + '$');
var replacerRegex = new RegExp('{|}', 'g');

function isDigit(char) {
  return DIGIT_REGEX.test(char);
}

function isAlpha(char) {
  return ALPHA_REGEX.test(char);
}

function createRegexForChar(char) {
  if (isDigit(char)) {
    return DIGIT_REGEX;
  } else if (isAlpha(char)) {
    return ALPHA_REGEX;
  }

  return WILD_REGEX;
}

function isPlaceholder(char) {
  return PLACEHOLDER_REGEX.test(char);
}

function isPlaceholderPattern(str) {
  return PLACEHOLDER_PATTERN_REGEX.test(str);
}

module.exports = function parsePattern(patternString) {
  var index, i, j, patternPart, placeholderChars, placeholderChar;
  var patternArray = [];
  var patternParts = patternString.match(PATTERN_REGEX);

  for (index = 0, i = 0; i < patternParts.length; i++) {
    patternPart = patternParts[i];

    if (isPlaceholderPattern(patternPart)) {
      placeholderChars = patternPart.replace(replacerRegex, '').split('');
      for (j = 0; j < placeholderChars.length; j++) {
        placeholderChar = placeholderChars[j];

        if (!isPlaceholder(placeholderChar)) {
          throw new Error('Only alphanumeric or wildcard pattern matchers are allowed');
        }

        patternArray.push({
          value: createRegexForChar(placeholderChar),
          isPermaChar: false,
          index: index++
        });
      }
    } else {
      patternArray.push({
        value: patternPart,
        isPermaChar: true,
        index: index++
      });
    }
  }

  return patternArray;
};
