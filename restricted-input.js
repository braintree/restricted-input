(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.RestrictedInput = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

module.exports = {
  errors: {
    PATTERN_MISSING: 'A valid pattern must be provided',
    INVALID_ELEMENT: 'A valid HTML input or textarea element must be provided'
  }
};

},{}],2:[function(require,module,exports){
(function (global){
'use strict';

var UA = global.navigator && global.navigator.userAgent;

var isAndroid = require('@braintree/browser-detection/is-android');
var isChrome = require('@braintree/browser-detection/is-chrome');
var isIos = require('@braintree/browser-detection/is-ios');
var isIE9 = require('@braintree/browser-detection/is-ie9');

// Old Android Webviews used specific versions of Chrome with 0.0.0 as their version suffix
// https://developer.chrome.com/multidevice/user-agent#webview_user_agent
var KITKAT_WEBVIEW_REGEX = /Version\/\d\.\d* Chrome\/\d*\.0\.0\.0/;

function _isOldSamsungBrowserOrSamsungWebview(ua) {
  return !isChrome(ua) && ua.indexOf('Samsung') > -1;
}

function isKitKatWebview(uaArg) {
  var ua = uaArg || UA;

  return isAndroid(ua) && KITKAT_WEBVIEW_REGEX.test(ua);
}

function isAndroidChrome(uaArg) {
  var ua = uaArg || UA;

  return isAndroid(ua) && isChrome(ua);
}

function isSamsungBrowser(ua) {
  ua = ua || UA;

  return /SamsungBrowser/.test(ua) || _isOldSamsungBrowserOrSamsungWebview(ua);
}

module.exports = {
  isIE9: isIE9,
  isAndroidChrome: isAndroidChrome,
  isIos: isIos,
  isKitKatWebview: isKitKatWebview,
  isSamsungBrowser: isSamsungBrowser
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"@braintree/browser-detection/is-android":18,"@braintree/browser-detection/is-chrome":19,"@braintree/browser-detection/is-ie9":21,"@braintree/browser-detection/is-ios":22}],3:[function(require,module,exports){
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

},{"../is-backspace":6,"./parse-pattern":4}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
'use strict';

function get(element) {
  var start, end;

  start = element.selectionStart;
  end = element.selectionEnd;

  return {
    start: start,
    end: end,
    delta: Math.abs(end - start)
  };
}

function set(element, start, end) {
  // Some browsers explode if you use setSelectionRange
  // on a non-focused element
  if (document.activeElement === element && element.setSelectionRange) {
    element.setSelectionRange(start, end);
  }
}

module.exports = {
  get: get,
  set: set
};

},{}],6:[function(require,module,exports){
'use strict';

module.exports = function (event) {
  return event.key === 'Backspace' || event.keyCode === 8;
};

},{}],7:[function(require,module,exports){
'use strict';

var DELETE_REGEX = /^Del(ete)?$/;

module.exports = function (event) {
  return DELETE_REGEX.test(event.key) || event.keyCode === 46;
};

},{}],8:[function(require,module,exports){
'use strict';

module.exports = function (element) {
  return Boolean(element) && (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement);
};

},{}],9:[function(require,module,exports){
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

},{"./input-selection":5}],10:[function(require,module,exports){
'use strict';

var device = require('./device');
var supportsInputFormatting = require('../supports-input-formatting');
var constants = require('./constants');
var isValidElement = require('./is-valid-element');
var IosStrategy = require('./strategies/ios');
var AndroidChromeStrategy = require('./strategies/android-chrome');
var KitKatChromiumBasedWebViewStrategy = require('./strategies/kitkat-chromium-based-webview');
var IE9Strategy = require('./strategies/ie9');
var BaseStrategy = require('./strategies/base');
var NoopStrategy = require('./strategies/noop');

/**
 * Instances of this class can be used to modify the formatter for an input
 * @class
 * @param {object} options The initialization paramaters for this class
 * @param {object} options.element - A Input DOM object that RestrictedInput operates on
 * @param {string} options.pattern - The pattern to enforce on this element
 */
function RestrictedInput(options) {
  options = options || {};

  if (!isValidElement(options.element)) {
    throw new Error(constants.errors.INVALID_ELEMENT);
  }

  if (!options.pattern) {
    throw new Error(constants.errors.PATTERN_MISSING);
  }

  if (!RestrictedInput.supportsFormatting()) {
    this.strategy = new NoopStrategy(options);
  } else if (device.isIos()) {
    this.strategy = new IosStrategy(options);
  } else if (device.isKitKatWebview()) {
    this.strategy = new KitKatChromiumBasedWebViewStrategy(options);
  } else if (device.isAndroidChrome()) {
    this.strategy = new AndroidChromeStrategy(options);
  } else if (device.isIE9()) {
    this.strategy = new IE9Strategy(options);
  } else {
    this.strategy = new BaseStrategy(options);
  }
}

/**
 * @public
 * @returns {string} the unformatted value of the element
 */
RestrictedInput.prototype.getUnformattedValue = function () {
  return this.strategy.getUnformattedValue();
};

/**
 * @public
 * @param {string} pattern - the pattern to enforce on the element
 * @return {void}
 */
RestrictedInput.prototype.setPattern = function (pattern) {
  this.strategy.setPattern(pattern);
};

RestrictedInput.supportsFormatting = function () {
  return supportsInputFormatting();
};

module.exports = RestrictedInput;

},{"../supports-input-formatting":24,"./constants":1,"./device":2,"./is-valid-element":8,"./strategies/android-chrome":11,"./strategies/base":12,"./strategies/ie9":13,"./strategies/ios":14,"./strategies/kitkat-chromium-based-webview":15,"./strategies/noop":16}],11:[function(require,module,exports){
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

},{"../input-selection":5,"../key-cannot-mutate-value":9,"./base":12}],12:[function(require,module,exports){
(function (global){
'use strict';

var keyCannotMutateValue = require('../key-cannot-mutate-value');
var getSelection = require('../input-selection').get;
var setSelection = require('../input-selection').set;
var isBackspace = require('../is-backspace');
var isDelete = require('../is-delete');
var Formatter = require('../formatter');

function BaseStrategy(options) {
  this.isFormatted = false;
  this.inputElement = options.element;
  this.formatter = new Formatter(options.pattern);

  this._attachListeners();

  if (this.inputElement.value) {
    this._reformatInput();
  }
}

function isSimulatedEvent(event) {
  // 1Password sets input.value then fires keyboard events. Dependent on browser
  // here might be falsy values (key = '', keyCode = 0) or these keys might be omitted
  // Chrome autofill inserts keys all at once and fires a single event without key info
  return !event.key && !event.keyCode;
}

BaseStrategy.prototype.getUnformattedValue = function (forceUnformat) {
  var value = this.inputElement.value;

  if (forceUnformat || this.isFormatted) {
    value = this.formatter.unformat({
      value: this.inputElement.value,
      selection: {start: 0, end: 0}
    }).value;
  }

  return value;
};

BaseStrategy.prototype.setPattern = function (pattern) {
  this._unformatInput();

  this.formatter = new Formatter(pattern);

  this._reformatInput();
};

BaseStrategy.prototype._attachListeners = function () {
  var self = this;

  self.inputElement.addEventListener('keydown', function (event) {
    if (isSimulatedEvent(event)) {
      self.isFormatted = false;
    }
    if (keyCannotMutateValue(event)) { return; }
    if (self._isDeletion(event)) {
      self._unformatInput(event);
    }
  });
  self.inputElement.addEventListener('keypress', function (event) {
    if (isSimulatedEvent(event)) {
      self.isFormatted = false;
    }

    if (keyCannotMutateValue(event)) { return; }
    self._unformatInput(event);
  });
  self.inputElement.addEventListener('keyup', function (event) {
    self._reformatInput(event);
  });
  self.inputElement.addEventListener('input', function (event) {
    // Safari AutoFill fires CustomEvents
    // LastPass sends an `isTrusted: false` property
    // Since the input is changed all at once, set isFormatted
    // to false so that reformatting actually occurs
    if (event instanceof CustomEvent || !event.isTrusted) {
      self.isFormatted = false;
    }
    self._reformatInput(event);
  });
  self.inputElement.addEventListener('paste', this._pasteEventHandler.bind(this));
};

BaseStrategy.prototype._isDeletion = function (event) {
  return isDelete(event) || isBackspace(event);
};

BaseStrategy.prototype._reformatInput = function () {
  var input, formattedState;

  if (this.isFormatted) { return; }

  this.isFormatted = true;
  input = this.inputElement;
  formattedState = this.formatter.format({
    selection: getSelection(input),
    value: input.value
  });

  input.value = formattedState.value;
  setSelection(input, formattedState.selection.start, formattedState.selection.end);

  this._afterReformatInput(formattedState);
};

// If a strategy needs to impliment specific behavior
// after reformatting has happend, the strategy just
// overwrites this method on their own prototype
BaseStrategy.prototype._afterReformatInput = function () { };

BaseStrategy.prototype._unformatInput = function () {
  var input, unformattedState, selection;

  if (!this.isFormatted) { return; }

  this.isFormatted = false;
  input = this.inputElement;
  selection = getSelection(input);

  unformattedState = this.formatter.unformat({
    selection: selection,
    value: input.value
  });

  input.value = unformattedState.value;
  setSelection(input, unformattedState.selection.start, unformattedState.selection.end);
};

BaseStrategy.prototype._prePasteEventHandler = function (event) {
  // without this, the paste event is called twice
  // so if you were pasting abc it would result in
  // abcabc
  event.preventDefault();
};

BaseStrategy.prototype._postPasteEventHandler = function () {
  this._reformatAfterPaste();
};

BaseStrategy.prototype._pasteEventHandler = function (event) {
  var selection, splicedEntry;
  var entryValue = '';

  this._prePasteEventHandler(event);

  this._unformatInput();

  if (event.clipboardData) {
    entryValue = event.clipboardData.getData('Text');
  } else if (global.clipboardData) {
    entryValue = global.clipboardData.getData('Text');
  }

  selection = getSelection(this.inputElement);
  splicedEntry = this.inputElement.value.split('');

  splicedEntry.splice(selection.start, selection.end - selection.start, entryValue);
  splicedEntry = splicedEntry.join('');

  this.inputElement.value = splicedEntry;
  setSelection(this.inputElement, selection.start + entryValue.length, selection.start + entryValue.length);

  this._postPasteEventHandler();
};

BaseStrategy.prototype._reformatAfterPaste = function () {
  var event = document.createEvent('Event');

  this._reformatInput();

  event.initEvent('input', true, true);
  this.inputElement.dispatchEvent(event);
};

BaseStrategy.prototype._getStateToFormat = function () {
  var input = this.inputElement;
  var selection = getSelection(input);
  var stateToFormat = {
    selection: selection,
    value: input.value
  };

  if (this._stateToFormat) {
    stateToFormat = this._stateToFormat;
    delete this._stateToFormat;
  } else if (selection.start === input.value.length && this.isFormatted) {
    stateToFormat = this.formatter.unformat(stateToFormat);
  }

  return stateToFormat;
};

module.exports = BaseStrategy;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../formatter":3,"../input-selection":5,"../is-backspace":6,"../is-delete":7,"../key-cannot-mutate-value":9}],13:[function(require,module,exports){
'use strict';

var BaseStrategy = require('./base');
var keyCannotMutateValue = require('../key-cannot-mutate-value');
var getSelection = require('../input-selection').get;
var setSelection = require('../input-selection').set;

function IE9Strategy(options) {
  BaseStrategy.call(this, options);
}

IE9Strategy.prototype = Object.create(BaseStrategy.prototype);
IE9Strategy.prototype.constructor = IE9Strategy;

IE9Strategy.prototype.getUnformattedValue = function () {
  return BaseStrategy.prototype.getUnformattedValue.call(this, true);
};

IE9Strategy.prototype._attachListeners = function () {
  this.inputElement.addEventListener('keydown', this._keydownListener.bind(this));
  this.inputElement.addEventListener('focus', this._format.bind(this));
  this.inputElement.addEventListener('paste', this._pasteEventHandler.bind(this));
};

IE9Strategy.prototype._format = function () {
  var input = this.inputElement;
  var stateToFormat = this._getStateToFormat();
  var formattedState = this.formatter.format(stateToFormat);

  input.value = formattedState.value;
  setSelection(input, formattedState.selection.start, formattedState.selection.end);
};

IE9Strategy.prototype._keydownListener = function (event) {
  var newValue, oldValue, selection;

  if (keyCannotMutateValue(event)) { return; }

  event.preventDefault();

  if (this._isDeletion(event)) {
    this._stateToFormat = this.formatter.simulateDeletion({
      event: event,
      selection: getSelection(this.inputElement),
      value: this.inputElement.value
    });
  } else {
    // IE9 does not update the input's value attribute
    // during key events, only after they complete.
    // We must retrieve the key from event.key and
    // add it to the input's value before formatting.
    oldValue = this.inputElement.value;
    selection = getSelection(this.inputElement);
    newValue = oldValue.slice(0, selection.start) + event.key + oldValue.slice(selection.start);
    selection = padSelection(selection, 1);

    this._stateToFormat = {
      selection: selection,
      value: newValue
    };
    if (selection.start === newValue.length) {
      this._stateToFormat = this.formatter.unformat(this._stateToFormat);
    }
  }

  this._format();
};

IE9Strategy.prototype._reformatAfterPaste = function () {
  var input = this.inputElement;
  var selection = getSelection(this.inputElement);
  var value = this.formatter.format({
    selection: selection,
    value: input.value
  }).value;

  selection = padSelection(selection, 1);
  input.value = value;
  // IE9 sets the selection to the end of the input
  // manually setting it in a setTimeout puts it
  // in the correct position after pasting
  setTimeout(function () {
    setSelection(input, selection.start, selection.end);
  }, 0);
};

function padSelection(selection, pad) {
  return {
    start: selection.start + pad,
    end: selection.end + pad
  };
}

module.exports = IE9Strategy;

},{"../input-selection":5,"../key-cannot-mutate-value":9,"./base":12}],14:[function(require,module,exports){
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

},{"../input-selection":5,"../key-cannot-mutate-value":9,"./base":12}],15:[function(require,module,exports){
'use strict';

// Android Devices on KitKat use Chromium based webviews. For some reason,
// the value of the inputs are not accessible in the event loop where the
// key event listeners are called. This causes formatting to get stuck
// on permacharacters. By putting them in setTimeouts, this fixes the
// problem. This causes other problems in non-webviews, so we give it
// its own strategy.

var AndroidChromeStrategy = require('./android-chrome');

function KitKatChromiumBasedWebViewStrategy(options) {
  AndroidChromeStrategy.call(this, options);
}

KitKatChromiumBasedWebViewStrategy.prototype = Object.create(AndroidChromeStrategy.prototype);
KitKatChromiumBasedWebViewStrategy.prototype.constructor = KitKatChromiumBasedWebViewStrategy;

KitKatChromiumBasedWebViewStrategy.prototype._reformatInput = function () {
  setTimeout(function () {
    AndroidChromeStrategy.prototype._reformatInput.call(this);
  }.bind(this), 0);
};

KitKatChromiumBasedWebViewStrategy.prototype._unformatInput = function () {
  setTimeout(function () {
    AndroidChromeStrategy.prototype._unformatInput.call(this);
  }.bind(this), 0);
};

module.exports = KitKatChromiumBasedWebViewStrategy;

},{"./android-chrome":11}],16:[function(require,module,exports){
'use strict';

function NoopStrategy(options) {
  this.inputElement = options.element;
}

NoopStrategy.prototype.getUnformattedValue = function () {
  return this.inputElement.value;
};

NoopStrategy.prototype.setPattern = function () {};

module.exports = NoopStrategy;

},{}],17:[function(require,module,exports){
module.exports = require('./lib/restricted-input');

},{"./lib/restricted-input":10}],18:[function(require,module,exports){
(function (global){
'use strict';

module.exports = function isAndroid(ua) {
  ua = ua || global.navigator.userAgent;
  return /Android/.test(ua);
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],19:[function(require,module,exports){
'use strict';

var isEdge = require('./is-edge');
var isSamsung = require('./is-samsung');

module.exports = function isChrome(ua) {
  ua = ua || navigator.userAgent;
  return (ua.indexOf('Chrome') !== -1 || ua.indexOf('CriOS') !== -1) && !isEdge(ua) && !isSamsung(ua);
};

},{"./is-edge":20,"./is-samsung":23}],20:[function(require,module,exports){
'use strict';

module.exports = function isEdge(ua) {
  ua = ua || navigator.userAgent;
  return ua.indexOf('Edge/') !== -1;
};

},{}],21:[function(require,module,exports){
'use strict';

module.exports = function isIe9(ua) {
  ua = ua || navigator.userAgent;
  return ua.indexOf('MSIE 9') !== -1;
};

},{}],22:[function(require,module,exports){
(function (global){
'use strict';

module.exports = function isIos(ua) {
  ua = ua || global.navigator.userAgent;
  return /iPhone|iPod|iPad/i.test(ua);
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],23:[function(require,module,exports){
(function (global){
'use strict';

module.exports = function isSamsungBrowser(ua) {
  ua = ua || global.navigator.userAgent;
  return /SamsungBrowser/i.test(ua);
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],24:[function(require,module,exports){
'use strict';

var device = require('./lib/device');

module.exports = function () {
  // Digits get dropped in samsung browser
  return !device.isSamsungBrowser();
};

},{"./lib/device":2}]},{},[17])(17)
});
