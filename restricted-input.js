(function (f) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;
    if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }
    g.RestrictedInput = f();
  }
})(function () {
  var define, module, exports;
  return (function () {
    function r(e, n, t) {
      function o(i, f) {
        if (!n[i]) {
          if (!e[i]) {
            var c = "function" == typeof require && require;
            if (!f && c) return c(i, !0);
            if (u) return u(i, !0);
            var a = new Error("Cannot find module '" + i + "'");
            throw ((a.code = "MODULE_NOT_FOUND"), a);
          }
          var p = (n[i] = { exports: {} });
          e[i][0].call(
            p.exports,
            function (r) {
              var n = e[i][1][r];
              return o(n || r);
            },
            p,
            p.exports,
            r,
            e,
            n,
            t
          );
        }
        return n[i].exports;
      }
      for (
        var u = "function" == typeof require && require, i = 0;
        i < t.length;
        i++
      )
        o(t[i]);
      return o;
    }
    return r;
  })()(
    {
      1: [
        function (require, module, exports) {
          (function (global) {
            "use strict";

            module.exports = function isAndroid(ua) {
              ua = ua || global.navigator.userAgent;

              return /Android/.test(ua);
            };
          }.call(
            this,
            typeof global !== "undefined"
              ? global
              : typeof self !== "undefined"
              ? self
              : typeof window !== "undefined"
              ? window
              : {}
          ));
        },
        {},
      ],
      2: [
        function (require, module, exports) {
          (function (global) {
            "use strict";

            module.exports = function isChromeOS(ua) {
              ua = ua || global.navigator.userAgent;

              return /CrOS/i.test(ua);
            };
          }.call(
            this,
            typeof global !== "undefined"
              ? global
              : typeof self !== "undefined"
              ? self
              : typeof window !== "undefined"
              ? window
              : {}
          ));
        },
        {},
      ],
      3: [
        function (require, module, exports) {
          "use strict";

          var isEdge = require("./is-edge");
          var isSamsung = require("./is-samsung");

          module.exports = function isChrome(ua) {
            ua = ua || navigator.userAgent;

            return (
              (ua.indexOf("Chrome") !== -1 || ua.indexOf("CriOS") !== -1) &&
              !isEdge(ua) &&
              !isSamsung(ua)
            );
          };
        },
        { "./is-edge": 4, "./is-samsung": 7 },
      ],
      4: [
        function (require, module, exports) {
          "use strict";

          module.exports = function isEdge(ua) {
            ua = ua || navigator.userAgent;

            return ua.indexOf("Edge/") !== -1;
          };
        },
        {},
      ],
      5: [
        function (require, module, exports) {
          "use strict";

          module.exports = function isIe9(ua) {
            ua = ua || navigator.userAgent;

            return ua.indexOf("MSIE 9") !== -1;
          };
        },
        {},
      ],
      6: [
        function (require, module, exports) {
          (function (global) {
            "use strict";

            module.exports = function isIos(ua) {
              ua = ua || global.navigator.userAgent;

              return /iPhone|iPod|iPad/i.test(ua);
            };
          }.call(
            this,
            typeof global !== "undefined"
              ? global
              : typeof self !== "undefined"
              ? self
              : typeof window !== "undefined"
              ? window
              : {}
          ));
        },
        {},
      ],
      7: [
        function (require, module, exports) {
          (function (global) {
            "use strict";

            module.exports = function isSamsungBrowser(ua) {
              ua = ua || global.navigator.userAgent;

              return /SamsungBrowser/i.test(ua);
            };
          }.call(
            this,
            typeof global !== "undefined"
              ? global
              : typeof self !== "undefined"
              ? self
              : typeof window !== "undefined"
              ? window
              : {}
          ));
        },
        {},
      ],
      8: [
        function (require, module, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          exports.isIos = exports.isIE9 = exports.isSamsungBrowser = exports.isAndroidChrome = exports.isKitKatWebview = void 0;
          var UA = window.navigator && window.navigator.userAgent;
          // TODO remove this when browser detection is converted to typescript
          /* eslint-disable @typescript-eslint/ban-ts-ignore */
          // @ts-ignore
          var isAndroid = require("@braintree/browser-detection/is-android");
          // @ts-ignore
          var isChromeOs = require("@braintree/browser-detection/is-chrome-os");
          // @ts-ignore
          var isChrome = require("@braintree/browser-detection/is-chrome");
          // @ts-ignore
          var isIos = require("@braintree/browser-detection/is-ios");
          exports.isIos = isIos;
          // @ts-ignore
          var isIE9 = require("@braintree/browser-detection/is-ie9");
          exports.isIE9 = isIE9;
          /* eslint-enable @typescript-eslint/ban-ts-ignore */
          // Old Android Webviews used specific versions of Chrome with 0.0.0 as their version suffix
          // https://developer.chrome.com/multidevice/user-agent#webview_user_agent
          var KITKAT_WEBVIEW_REGEX = /Version\/\d\.\d* Chrome\/\d*\.0\.0\.0/;
          function isOldSamsungBrowserOrSamsungWebview(ua) {
            return !isChrome(ua) && ua.indexOf("Samsung") > -1;
          }
          function isKitKatWebview(ua) {
            if (ua === void 0) {
              ua = UA;
            }
            return isAndroid(ua) && KITKAT_WEBVIEW_REGEX.test(ua);
          }
          exports.isKitKatWebview = isKitKatWebview;
          function isAndroidChrome(ua) {
            if (ua === void 0) {
              ua = UA;
            }
            return (isAndroid(ua) || isChromeOs(ua)) && isChrome(ua);
          }
          exports.isAndroidChrome = isAndroidChrome;
          function isSamsungBrowser(ua) {
            if (ua === void 0) {
              ua = UA;
            }
            return (
              /SamsungBrowser/.test(ua) ||
              isOldSamsungBrowserOrSamsungWebview(ua)
            );
          }
          exports.isSamsungBrowser = isSamsungBrowser;
        },
        {
          "@braintree/browser-detection/is-android": 1,
          "@braintree/browser-detection/is-chrome": 3,
          "@braintree/browser-detection/is-chrome-os": 2,
          "@braintree/browser-detection/is-ie9": 5,
          "@braintree/browser-detection/is-ios": 6,
        },
      ],
      9: [
        function (require, module, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          exports.PatternFormatter = void 0;
          var parse_pattern_1 = require("./parse-pattern");
          var is_backspace_1 = require("../is-backspace");
          var PatternFormatter = /** @class */ (function () {
            function PatternFormatter(pattern) {
              this.pattern = parse_pattern_1.parsePattern(pattern);
            }
            PatternFormatter.prototype.format = function (options) {
              var originalString = options.value;
              var originalStringIndex = 0;
              var formattedString = "";
              var selection = {
                start: options.selection.start,
                end: options.selection.end,
              };
              for (var i = 0; i < this.pattern.length; i++) {
                var patternChar = this.pattern[i];
                var inputChar = originalString[originalStringIndex];
                if (originalStringIndex > originalString.length) {
                  break;
                }
                if (typeof patternChar.value === "string") {
                  if (
                    inputChar != null ||
                    formattedString.length === patternChar.index
                  ) {
                    formattedString += patternChar.value;
                    if (patternChar.index <= selection.start) {
                      selection.start++;
                    }
                    if (patternChar.index <= selection.end) {
                      selection.end++;
                    }
                  }
                } else {
                  // User input char
                  // prettier-ignore
                  for (; originalStringIndex < originalString.length; originalStringIndex++) {
                    inputChar = originalString[originalStringIndex];
                    if (patternChar.value.test(inputChar)) {
                        formattedString += inputChar;
                        originalStringIndex++;
                        break;
                    }
                    else {
                        if (patternChar.index <= selection.start) {
                            selection.start--;
                        }
                        if (patternChar.index <= selection.end) {
                            selection.end--;
                        }
                    }
                }
                }
              }
              return {
                value: formattedString,
                selection: selection,
              };
            };
            PatternFormatter.prototype.unformat = function (options) {
              var start = options.selection.start;
              var end = options.selection.end;
              var unformattedString = "";
              for (var i = 0; i < this.pattern.length; i++) {
                var patternChar = this.pattern[i];
                if (
                  typeof patternChar.value !== "string" &&
                  options.value[i] != null &&
                  patternChar.value.test(options.value[i])
                ) {
                  unformattedString += options.value[i];
                  continue;
                }
                if (patternChar.value !== options.value[patternChar.index]) {
                  continue;
                }
                if (patternChar.index < options.selection.start) {
                  start--;
                }
                if (patternChar.index < options.selection.end) {
                  end--;
                }
              }
              return {
                selection: {
                  start: start,
                  end: end,
                },
                value: unformattedString,
              };
            };
            PatternFormatter.prototype.simulateDeletion = function (options) {
              var deletionStart, deletionEnd;
              var state = this.unformat(options);
              var value = state.value;
              var selection = state.selection;
              var delta = Math.abs(state.selection.end - state.selection.start);
              if (delta) {
                deletionStart = selection.start;
                deletionEnd = selection.end;
              } else if (is_backspace_1.isBackspace(options.event)) {
                deletionStart = Math.max(0, selection.start - 1);
                deletionEnd = selection.start;
              } else {
                // Handle forward delete
                deletionStart = selection.start;
                deletionEnd = Math.min(value.length, selection.start + 1);
              }
              return {
                selection: {
                  start: deletionStart,
                  end: deletionStart,
                },
                value:
                  value.substr(0, deletionStart) + value.substr(deletionEnd),
              };
            };
            return PatternFormatter;
          })();
          exports.PatternFormatter = PatternFormatter;
        },
        { "../is-backspace": 12, "./parse-pattern": 10 },
      ],
      10: [
        function (require, module, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          exports.parsePattern = void 0;
          var ALPHA_REGEX = /[A-Za-z]/;
          var DIGIT_REGEX = /\d/;
          var WILD_REGEX = /./;
          var PLACEHOLDER_REGEX = /^[A-Za-z0-9\*]$/;
          var PLACEHOLDER_PATTERN = "({{[^}]+}})";
          var PERMACHAR_REGEX = "(\\s|\\S)";
          var PATTERN_REGEX = new RegExp(
            PLACEHOLDER_PATTERN + "|" + PERMACHAR_REGEX,
            "g"
          );
          var PLACEHOLDER_PATTERN_REGEX = new RegExp(
            "^" + PLACEHOLDER_PATTERN + "$"
          );
          var replacerRegex = new RegExp("{|}", "g");
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
          function parsePattern(patternString) {
            var patternArray = [];
            var patternParts = patternString.match(PATTERN_REGEX);
            if (!patternParts) {
              return patternArray;
            }
            for (var index = 0, i = 0; i < patternParts.length; i++) {
              var patternPart = patternParts[i];
              if (isPlaceholderPattern(patternPart)) {
                var placeholderChars = patternPart
                  .replace(replacerRegex, "")
                  .split("");
                for (var j = 0; j < placeholderChars.length; j++) {
                  var placeholderChar = placeholderChars[j];
                  if (!isPlaceholder(placeholderChar)) {
                    throw new Error(
                      "Only alphanumeric or wildcard pattern matchers are allowed"
                    );
                  }
                  patternArray.push({
                    value: createRegexForChar(placeholderChar),
                    isPermaChar: false,
                    index: index++,
                  });
                }
              } else {
                patternArray.push({
                  value: patternPart,
                  isPermaChar: true,
                  index: index++,
                });
              }
            }
            return patternArray;
          }
          exports.parsePattern = parsePattern;
        },
        {},
      ],
      11: [
        function (require, module, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          exports.set = exports.get = void 0;
          function get(element) {
            var start = element.selectionStart || 0;
            var end = element.selectionEnd || 0;
            return {
              start: start,
              end: end,
              delta: Math.abs(end - start),
            };
          }
          exports.get = get;
          function set(element, start, end) {
            // Some browsers explode if you use setSelectionRange
            // on a non-focused element
            if (
              document.activeElement === element &&
              element.setSelectionRange
            ) {
              element.setSelectionRange(start, end);
            }
          }
          exports.set = set;
        },
        {},
      ],
      12: [
        function (require, module, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          exports.isBackspace = void 0;
          function isBackspace(event) {
            return event.key === "Backspace" || event.keyCode === 8;
          }
          exports.isBackspace = isBackspace;
        },
        {},
      ],
      13: [
        function (require, module, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          exports.isDelete = void 0;
          var DELETE_REGEX = /^Del(ete)?$/;
          function isDelete(event) {
            return DELETE_REGEX.test(event.key) || event.keyCode === 46;
          }
          exports.isDelete = isDelete;
        },
        {},
      ],
      14: [
        function (require, module, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          exports.keyCannotMutateValue = void 0;
          var input_selection_1 = require("./input-selection");
          // eslint-disable-next-line complexity
          function keyCannotMutateValue(event) {
            var input = event.currentTarget || event.srcElement;
            var selection = input_selection_1.get(input);
            var isAtBeginning = selection.start === 0;
            var isAtEnd = selection.start === input.value.length;
            var isShifted = event.shiftKey === true;
            // https://www.w3.org/TR/DOM-Level-3-Events/#widl-KeyboardEvent-key
            switch (event.key) {
              case undefined: // eslint-disable-line
              case "Unidentified": // Cannot be determined
              case "": // Uninitialized
                break;
              case "Backspace": // backspace at the beginning
                return isAtBeginning;
              case "Del": // delete at the end
              case "Delete":
                return isAtEnd;
              default:
                return event.key.length !== 1;
            }
            // http://unixpapa.com/js/key.html
            switch (event.keyCode) {
              case 9: // tab
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
          }
          exports.keyCannotMutateValue = keyCannotMutateValue;
        },
        { "./input-selection": 11 },
      ],
      15: [
        function (require, module, exports) {
          "use strict";
          var device_1 = require("./device");
          var supportsInputFormatting = require("../supports-input-formatting");
          var ios_1 = require("./strategies/ios");
          var android_chrome_1 = require("./strategies/android-chrome");
          var kitkat_chromium_based_webview_1 = require("./strategies/kitkat-chromium-based-webview");
          var ie9_1 = require("./strategies/ie9");
          var base_1 = require("./strategies/base");
          var noop_1 = require("./strategies/noop");
          /**
           * Instances of this class can be used to modify the formatter for an input
           * @class
           * @param {object} options The initialization paramaters for this class
           * @param {object} options.element - A Input DOM object that RestrictedInput operates on
           * @param {string} options.pattern - The pattern to enforce on this element
           */
          var RestrictedInput = /** @class */ (function () {
            function RestrictedInput(options) {
              if (!RestrictedInput.supportsFormatting()) {
                this.strategy = new noop_1.NoopKeyboardStrategy(options);
              } else if (device_1.isIos()) {
                this.strategy = new ios_1.IosStrategy(options);
              } else if (device_1.isKitKatWebview()) {
                this.strategy = new kitkat_chromium_based_webview_1.KitKatChromiumBasedWebViewStrategy(
                  options
                );
              } else if (device_1.isAndroidChrome()) {
                this.strategy = new android_chrome_1.AndroidChromeStrategy(
                  options
                );
              } else if (device_1.isIE9()) {
                this.strategy = new ie9_1.IE9Strategy(options);
              } else {
                this.strategy = new base_1.BaseStrategy(options);
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
            return RestrictedInput;
          })();
          module.exports = RestrictedInput;
        },
        {
          "../supports-input-formatting": 24,
          "./device": 8,
          "./strategies/android-chrome": 16,
          "./strategies/base": 17,
          "./strategies/ie9": 18,
          "./strategies/ios": 19,
          "./strategies/kitkat-chromium-based-webview": 20,
          "./strategies/noop": 21,
        },
      ],
      16: [
        function (require, module, exports) {
          "use strict";
          var __extends =
            (this && this.__extends) ||
            (function () {
              var extendStatics = function (d, b) {
                extendStatics =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (d, b) {
                      d.__proto__ = b;
                    }) ||
                  function (d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                  };
                return extendStatics(d, b);
              };
              return function (d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype =
                  b === null
                    ? Object.create(b)
                    : ((__.prototype = b.prototype), new __());
              };
            })();
          Object.defineProperty(exports, "__esModule", { value: true });
          exports.AndroidChromeStrategy = void 0;
          var key_cannot_mutate_value_1 = require("../key-cannot-mutate-value");
          var base_1 = require("./base");
          var input_selection_1 = require("../input-selection");
          var AndroidChromeStrategy = /** @class */ (function (_super) {
            __extends(AndroidChromeStrategy, _super);
            function AndroidChromeStrategy() {
              return (_super !== null && _super.apply(this, arguments)) || this;
            }
            AndroidChromeStrategy.prototype.attachListeners = function () {
              var _this = this;
              this.inputElement.addEventListener("keydown", function (event) {
                if (key_cannot_mutate_value_1.keyCannotMutateValue(event)) {
                  return;
                }
                _this.unformatInput();
              });
              // 'keypress' is not fired with some Android keyboards (see #23)
              this.inputElement.addEventListener("keypress", function (event) {
                if (key_cannot_mutate_value_1.keyCannotMutateValue(event)) {
                  return;
                }
                _this.unformatInput();
              });
              this.inputElement.addEventListener("keyup", function () {
                _this.reformatInput();
              });
              this.inputElement.addEventListener("input", function () {
                _this.reformatInput();
              });
              this.inputElement.addEventListener("paste", function (event) {
                _this.pasteEventHandler(event);
              });
            };
            AndroidChromeStrategy.prototype.prePasteEventHandler = function () {
              // the default strategy calls preventDefault here
              // but that removes the clipboard data in Android chrome
              // so we noop instead
            };
            AndroidChromeStrategy.prototype.postPasteEventHandler = function () {
              var _this = this;
              // the default strategy calls this without a timeout
              setTimeout(function () {
                _this.reformatAfterPaste();
              }, 0);
            };
            AndroidChromeStrategy.prototype.afterReformatInput = function (
              formattedState
            ) {
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
                input_selection_1.set(
                  input,
                  formattedSelection.end,
                  formattedSelection.end
                );
              }, 0);
            };
            return AndroidChromeStrategy;
          })(base_1.BaseStrategy);
          exports.AndroidChromeStrategy = AndroidChromeStrategy;
        },
        {
          "../input-selection": 11,
          "../key-cannot-mutate-value": 14,
          "./base": 17,
        },
      ],
      17: [
        function (require, module, exports) {
          "use strict";
          var __extends =
            (this && this.__extends) ||
            (function () {
              var extendStatics = function (d, b) {
                extendStatics =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (d, b) {
                      d.__proto__ = b;
                    }) ||
                  function (d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                  };
                return extendStatics(d, b);
              };
              return function (d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype =
                  b === null
                    ? Object.create(b)
                    : ((__.prototype = b.prototype), new __());
              };
            })();
          Object.defineProperty(exports, "__esModule", { value: true });
          exports.BaseStrategy = void 0;
          var strategy_interface_1 = require("./strategy-interface");
          var key_cannot_mutate_value_1 = require("../key-cannot-mutate-value");
          var input_selection_1 = require("../input-selection");
          var is_backspace_1 = require("../is-backspace");
          var is_delete_1 = require("../is-delete");
          var formatter_1 = require("../formatter");
          function isSimulatedEvent(event) {
            // 1Password sets input.value then fires keyboard events. Dependent on browser
            // here might be falsy values (key = '', keyCode = 0) or these keys might be omitted
            // Chrome autofill inserts keys all at once and fires a single event without key info
            return !event.key && !event.keyCode;
          }
          var BaseStrategy = /** @class */ (function (_super) {
            __extends(BaseStrategy, _super);
            function BaseStrategy(options) {
              var _this = _super.call(this, options) || this;
              _this.formatter = new formatter_1.PatternFormatter(
                options.pattern
              );
              _this.onPasteEvent = options.onPasteEvent;
              _this.attachListeners();
              _this.formatIfNotEmpty();
              return _this;
            }
            BaseStrategy.prototype.getUnformattedValue = function (
              forceUnformat
            ) {
              var value = this.inputElement.value;
              if (forceUnformat || this.isFormatted) {
                value = this.formatter.unformat({
                  value: this.inputElement.value,
                  selection: { start: 0, end: 0 },
                }).value;
              }
              return value;
            };
            BaseStrategy.prototype.formatIfNotEmpty = function () {
              if (this.inputElement.value) {
                this.reformatInput();
              }
            };
            BaseStrategy.prototype.setPattern = function (pattern) {
              this.unformatInput();
              this.formatter = new formatter_1.PatternFormatter(pattern);
              this.formatIfNotEmpty();
            };
            BaseStrategy.prototype.attachListeners = function () {
              var _this = this;
              this.inputElement.addEventListener("keydown", function (e) {
                var event = e;
                if (isSimulatedEvent(event)) {
                  _this.isFormatted = false;
                }
                if (key_cannot_mutate_value_1.keyCannotMutateValue(event)) {
                  return;
                }
                if (_this.isDeletion(event)) {
                  _this.unformatInput();
                }
              });
              this.inputElement.addEventListener("keypress", function (e) {
                var event = e;
                if (isSimulatedEvent(event)) {
                  _this.isFormatted = false;
                }
                if (key_cannot_mutate_value_1.keyCannotMutateValue(event)) {
                  return;
                }
                _this.unformatInput();
              });
              this.inputElement.addEventListener("keyup", function () {
                _this.reformatInput();
              });
              this.inputElement.addEventListener("input", function (event) {
                // Safari AutoFill fires CustomEvents
                // LastPass sends an `isTrusted: false` property
                // Since the input is changed all at once, set isFormatted
                // to false so that reformatting actually occurs
                if (event instanceof CustomEvent || !event.isTrusted) {
                  _this.isFormatted = false;
                }
                _this.reformatInput();
              });
              this.inputElement.addEventListener("paste", function (event) {
                _this.pasteEventHandler(event);
              });
            };
            BaseStrategy.prototype.isDeletion = function (event) {
              return (
                is_delete_1.isDelete(event) || is_backspace_1.isBackspace(event)
              );
            };
            BaseStrategy.prototype.reformatInput = function () {
              if (this.isFormatted) {
                return;
              }
              this.isFormatted = true;
              var input = this.inputElement;
              var formattedState = this.formatter.format({
                selection: input_selection_1.get(input),
                value: input.value,
              });
              input.value = formattedState.value;
              input_selection_1.set(
                input,
                formattedState.selection.start,
                formattedState.selection.end
              );
              this.afterReformatInput(formattedState);
            };
            // If a strategy needs to impliment specific behavior
            // after reformatting has happend, the strategy just
            // overwrites this method on their own prototype
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            BaseStrategy.prototype.afterReformatInput = function (
              formattedState
            ) {
              // noop
            };
            BaseStrategy.prototype.unformatInput = function () {
              if (!this.isFormatted) {
                return;
              }
              this.isFormatted = false;
              var input = this.inputElement;
              var selection = input_selection_1.get(input);
              var unformattedState = this.formatter.unformat({
                selection: selection,
                value: input.value,
              });
              input.value = unformattedState.value;
              input_selection_1.set(
                input,
                unformattedState.selection.start,
                unformattedState.selection.end
              );
            };
            BaseStrategy.prototype.prePasteEventHandler = function (event) {
              // without this, the paste event is called twice
              // so if you were pasting abc it would result in
              // abcabc
              event.preventDefault();
            };
            BaseStrategy.prototype.postPasteEventHandler = function () {
              this.reformatAfterPaste();
            };
            BaseStrategy.prototype.pasteEventHandler = function (event) {
              var splicedEntry;
              var entryValue = "";
              this.prePasteEventHandler(event);
              this.unformatInput();
              if (event.clipboardData) {
                entryValue = event.clipboardData.getData("Text");
              } else if (window.clipboardData) {
                entryValue = window.clipboardData.getData("Text");
              }
              var selection = input_selection_1.get(this.inputElement);
              splicedEntry = this.inputElement.value.split("");
              splicedEntry.splice(
                selection.start,
                selection.end - selection.start,
                entryValue
              );
              splicedEntry = splicedEntry.join("");
              if (this.onPasteEvent) {
                this.onPasteEvent({
                  unformattedInputValue: splicedEntry,
                });
              }
              this.inputElement.value = splicedEntry;
              input_selection_1.set(
                this.inputElement,
                selection.start + entryValue.length,
                selection.start + entryValue.length
              );
              this.postPasteEventHandler();
            };
            BaseStrategy.prototype.reformatAfterPaste = function () {
              var event = document.createEvent("Event");
              this.reformatInput();
              event.initEvent("input", true, true);
              this.inputElement.dispatchEvent(event);
            };
            BaseStrategy.prototype.getStateToFormat = function () {
              var input = this.inputElement;
              var selection = input_selection_1.get(input);
              var stateToFormat = {
                selection: selection,
                value: input.value,
              };
              if (this.stateToFormat) {
                stateToFormat = this.stateToFormat;
                delete this.stateToFormat;
              } else if (
                selection.start === input.value.length &&
                this.isFormatted
              ) {
                stateToFormat = this.formatter.unformat(stateToFormat);
              }
              return stateToFormat;
            };
            return BaseStrategy;
          })(strategy_interface_1.StrategyInterface);
          exports.BaseStrategy = BaseStrategy;
        },
        {
          "../formatter": 9,
          "../input-selection": 11,
          "../is-backspace": 12,
          "../is-delete": 13,
          "../key-cannot-mutate-value": 14,
          "./strategy-interface": 22,
        },
      ],
      18: [
        function (require, module, exports) {
          "use strict";
          var __extends =
            (this && this.__extends) ||
            (function () {
              var extendStatics = function (d, b) {
                extendStatics =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (d, b) {
                      d.__proto__ = b;
                    }) ||
                  function (d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                  };
                return extendStatics(d, b);
              };
              return function (d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype =
                  b === null
                    ? Object.create(b)
                    : ((__.prototype = b.prototype), new __());
              };
            })();
          Object.defineProperty(exports, "__esModule", { value: true });
          exports.IE9Strategy = void 0;
          var base_1 = require("./base");
          var key_cannot_mutate_value_1 = require("../key-cannot-mutate-value");
          var input_selection_1 = require("../input-selection");
          function padSelection(selection, pad) {
            return {
              start: selection.start + pad,
              end: selection.end + pad,
            };
          }
          var IE9Strategy = /** @class */ (function (_super) {
            __extends(IE9Strategy, _super);
            function IE9Strategy() {
              return (_super !== null && _super.apply(this, arguments)) || this;
            }
            IE9Strategy.prototype.getUnformattedValue = function () {
              return base_1.BaseStrategy.prototype.getUnformattedValue.call(
                this,
                true
              );
            };
            IE9Strategy.prototype.attachListeners = function () {
              var _this = this;
              this.inputElement.addEventListener("keydown", function (event) {
                _this.keydownListener(event);
              });
              this.inputElement.addEventListener("focus", function () {
                _this.format();
              });
              this.inputElement.addEventListener("paste", function (event) {
                _this.pasteEventHandler(event);
              });
            };
            IE9Strategy.prototype.format = function () {
              var input = this.inputElement;
              var stateToFormat = this.getStateToFormat();
              var formattedState = this.formatter.format(stateToFormat);
              input.value = formattedState.value;
              input_selection_1.set(
                input,
                formattedState.selection.start,
                formattedState.selection.end
              );
            };
            IE9Strategy.prototype.keydownListener = function (event) {
              if (key_cannot_mutate_value_1.keyCannotMutateValue(event)) {
                return;
              }
              event.preventDefault();
              if (this.isDeletion(event)) {
                this.stateToFormat = this.formatter.simulateDeletion({
                  event: event,
                  selection: input_selection_1.get(this.inputElement),
                  value: this.inputElement.value,
                });
              } else {
                // IE9 does not update the input's value attribute
                // during key events, only after they complete.
                // We must retrieve the key from event.key and
                // add it to the input's value before formatting.
                var oldValue = this.inputElement.value;
                var selection = input_selection_1.get(this.inputElement);
                var newValue =
                  oldValue.slice(0, selection.start) +
                  event.key +
                  oldValue.slice(selection.start);
                selection = padSelection(selection, 1);
                this.stateToFormat = {
                  selection: selection,
                  value: newValue,
                };
                if (selection.start === newValue.length) {
                  this.stateToFormat = this.formatter.unformat(
                    this.stateToFormat
                  );
                }
              }
              this.format();
            };
            IE9Strategy.prototype.reformatAfterPaste = function () {
              var input = this.inputElement;
              var selection = input_selection_1.get(this.inputElement);
              var value = this.formatter.format({
                selection: selection,
                value: input.value,
              }).value;
              selection = padSelection(selection, 1);
              input.value = value;
              // IE9 sets the selection to the end of the input
              // manually setting it in a setTimeout puts it
              // in the correct position after pasting
              setTimeout(function () {
                input_selection_1.set(input, selection.start, selection.end);
              }, 0);
            };
            return IE9Strategy;
          })(base_1.BaseStrategy);
          exports.IE9Strategy = IE9Strategy;
        },
        {
          "../input-selection": 11,
          "../key-cannot-mutate-value": 14,
          "./base": 17,
        },
      ],
      19: [
        function (require, module, exports) {
          "use strict";
          var __extends =
            (this && this.__extends) ||
            (function () {
              var extendStatics = function (d, b) {
                extendStatics =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (d, b) {
                      d.__proto__ = b;
                    }) ||
                  function (d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                  };
                return extendStatics(d, b);
              };
              return function (d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype =
                  b === null
                    ? Object.create(b)
                    : ((__.prototype = b.prototype), new __());
              };
            })();
          Object.defineProperty(exports, "__esModule", { value: true });
          exports.IosStrategy = void 0;
          var base_1 = require("./base");
          var key_cannot_mutate_value_1 = require("../key-cannot-mutate-value");
          var input_selection_1 = require("../input-selection");
          var IosStrategy = /** @class */ (function (_super) {
            __extends(IosStrategy, _super);
            function IosStrategy() {
              return (_super !== null && _super.apply(this, arguments)) || this;
            }
            IosStrategy.prototype.getUnformattedValue = function () {
              return _super.prototype.getUnformattedValue.call(this, true);
            };
            IosStrategy.prototype.attachListeners = function () {
              var _this = this;
              this.inputElement.addEventListener("keydown", function (event) {
                _this.keydownListener(event);
              });
              this.inputElement.addEventListener("input", function (event) {
                var isCustomEvent = event instanceof CustomEvent;
                // Safari AutoFill fires CustomEvents
                // Set state to format before calling format listener
                if (isCustomEvent) {
                  _this.stateToFormat = {
                    selection: { start: 0, end: 0 },
                    value: _this.inputElement.value,
                  };
                }
                _this.formatListener();
                if (!isCustomEvent) {
                  _this.fixLeadingBlankSpaceOnIos();
                }
              });
              this.inputElement.addEventListener("focus", function () {
                _this.formatListener();
              });
              this.inputElement.addEventListener("paste", function (event) {
                _this.pasteEventHandler(event);
              });
            };
            // When deleting the last character on iOS, the cursor
            // is positioned as if there is a blank space when there
            // is not, setting it to '' in a setTimeout fixes it ¯\_(ツ)_/¯
            IosStrategy.prototype.fixLeadingBlankSpaceOnIos = function () {
              var input = this.inputElement;
              if (input.value === "") {
                setTimeout(function () {
                  input.value = "";
                }, 0);
              }
            };
            IosStrategy.prototype.formatListener = function () {
              var input = this.inputElement;
              var stateToFormat = this.getStateToFormat();
              var formattedState = this.formatter.format(stateToFormat);
              input.value = formattedState.value;
              input_selection_1.set(
                input,
                formattedState.selection.start,
                formattedState.selection.end
              );
            };
            IosStrategy.prototype.keydownListener = function (event) {
              if (key_cannot_mutate_value_1.keyCannotMutateValue(event)) {
                return;
              }
              if (this.isDeletion(event)) {
                this.stateToFormat = this.formatter.simulateDeletion({
                  event: event,
                  selection: input_selection_1.get(this.inputElement),
                  value: this.inputElement.value,
                });
              }
            };
            return IosStrategy;
          })(base_1.BaseStrategy);
          exports.IosStrategy = IosStrategy;
        },
        {
          "../input-selection": 11,
          "../key-cannot-mutate-value": 14,
          "./base": 17,
        },
      ],
      20: [
        function (require, module, exports) {
          "use strict";
          // Android Devices on KitKat use Chromium based webviews. For some reason,
          // the value of the inputs are not accessible in the event loop where the
          // key event listeners are called. This causes formatting to get stuck
          // on permacharacters. By putting them in setTimeouts, this fixes the
          // problem. This causes other problems in non-webviews, so we give it
          // its own strategy.
          var __extends =
            (this && this.__extends) ||
            (function () {
              var extendStatics = function (d, b) {
                extendStatics =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (d, b) {
                      d.__proto__ = b;
                    }) ||
                  function (d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                  };
                return extendStatics(d, b);
              };
              return function (d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype =
                  b === null
                    ? Object.create(b)
                    : ((__.prototype = b.prototype), new __());
              };
            })();
          Object.defineProperty(exports, "__esModule", { value: true });
          exports.KitKatChromiumBasedWebViewStrategy = void 0;
          var android_chrome_1 = require("./android-chrome");
          var KitKatChromiumBasedWebViewStrategy = /** @class */ (function (
            _super
          ) {
            __extends(KitKatChromiumBasedWebViewStrategy, _super);
            function KitKatChromiumBasedWebViewStrategy() {
              return (_super !== null && _super.apply(this, arguments)) || this;
            }
            KitKatChromiumBasedWebViewStrategy.prototype.reformatInput = function () {
              var _this = this;
              setTimeout(function () {
                _super.prototype.reformatInput.call(_this);
              }, 0);
            };
            KitKatChromiumBasedWebViewStrategy.prototype.unformatInput = function () {
              var _this = this;
              setTimeout(function () {
                _super.prototype.unformatInput.call(_this);
              }, 0);
            };
            return KitKatChromiumBasedWebViewStrategy;
          })(android_chrome_1.AndroidChromeStrategy);
          exports.KitKatChromiumBasedWebViewStrategy = KitKatChromiumBasedWebViewStrategy;
        },
        { "./android-chrome": 16 },
      ],
      21: [
        function (require, module, exports) {
          "use strict";
          var __extends =
            (this && this.__extends) ||
            (function () {
              var extendStatics = function (d, b) {
                extendStatics =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (d, b) {
                      d.__proto__ = b;
                    }) ||
                  function (d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                  };
                return extendStatics(d, b);
              };
              return function (d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype =
                  b === null
                    ? Object.create(b)
                    : ((__.prototype = b.prototype), new __());
              };
            })();
          Object.defineProperty(exports, "__esModule", { value: true });
          exports.NoopKeyboardStrategy = void 0;
          var strategy_interface_1 = require("./strategy-interface");
          var NoopKeyboardStrategy = /** @class */ (function (_super) {
            __extends(NoopKeyboardStrategy, _super);
            function NoopKeyboardStrategy() {
              return (_super !== null && _super.apply(this, arguments)) || this;
            }
            NoopKeyboardStrategy.prototype.getUnformattedValue = function () {
              return this.inputElement.value;
            };
            NoopKeyboardStrategy.prototype.setPattern = function () {
              // noop
            };
            return NoopKeyboardStrategy;
          })(strategy_interface_1.StrategyInterface);
          exports.NoopKeyboardStrategy = NoopKeyboardStrategy;
        },
        { "./strategy-interface": 22 },
      ],
      22: [
        function (require, module, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          exports.StrategyInterface = void 0;
          var StrategyInterface = /** @class */ (function () {
            function StrategyInterface(options) {
              this.inputElement = options.element;
              this.isFormatted = false;
            }
            return StrategyInterface;
          })();
          exports.StrategyInterface = StrategyInterface;
        },
        {},
      ],
      23: [
        function (require, module, exports) {
          "use strict";
          var RestrictedInput = require("./lib/restricted-input");
          module.exports = RestrictedInput;
        },
        { "./lib/restricted-input": 15 },
      ],
      24: [
        function (require, module, exports) {
          "use strict";
          var device_1 = require("./lib/device");
          module.exports = function supportsInputFormatting() {
            // Digits get dropped in samsung browser
            return !device_1.isSamsungBrowser();
          };
        },
        { "./lib/device": 8 },
      ],
    },
    {},
    [23]
  )(23);
});
