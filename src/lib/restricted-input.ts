import { isIos, isKitKatWebview, isAndroidChrome, isIE9 } from "./device";
import supportsInputFormatting = require("../supports-input-formatting");
import { IosStrategy } from "./strategies/ios";
import { AndroidChromeStrategy } from "./strategies/android-chrome";
import { KitKatChromiumBasedWebViewStrategy } from "./strategies/kitkat-chromium-based-webview";
import { IE9Strategy } from "./strategies/ie9";
import {
  StrategyInterface,
  StrategyOptions,
} from "./strategies/strategy-interface";
import { BaseStrategy } from "./strategies/base";
import { NoopKeyboardStrategy as NoopStrategy } from "./strategies/noop";

/**
 * Instances of this class can be used to modify the formatter for an input
 * @class
 * @param {object} options The initialization paramaters for this class
 * @param {object} options.element - A Input DOM object that RestrictedInput operates on
 * @param {string} options.pattern - The pattern to enforce on this element
 */
class RestrictedInput {
  strategy: StrategyInterface;

  constructor(options: StrategyOptions) {
    if (!RestrictedInput.supportsFormatting()) {
      this.strategy = new NoopStrategy(options);
    } else if (isIos()) {
      this.strategy = new IosStrategy(options);
    } else if (isKitKatWebview()) {
      this.strategy = new KitKatChromiumBasedWebViewStrategy(options);
    } else if (isAndroidChrome()) {
      this.strategy = new AndroidChromeStrategy(options);
    } else if (isIE9()) {
      this.strategy = new IE9Strategy(options);
    } else {
      this.strategy = new BaseStrategy(options);
    }
  }

  /**
   * @public
   * @returns {string} the unformatted value of the element
   */
  getUnformattedValue(): string {
    return this.strategy.getUnformattedValue();
  }

  /**
   * @public
   * @param {string} pattern - the pattern to enforce on the element
   * @return {void}
   */
  setPattern(pattern: string): void {
    this.strategy.setPattern(pattern);
  }

  static supportsFormatting(): boolean {
    return supportsInputFormatting();
  }
}

export = RestrictedInput;
