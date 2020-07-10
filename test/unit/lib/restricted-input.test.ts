import RestrictedInput = require("../../../src/lib/restricted-input");
import { BaseStrategy } from "../../../src/lib/strategies/base";
import { IosStrategy } from "../../../src/lib/strategies/ios";
import { IE9Strategy } from "../../../src/lib/strategies/ie9";
import { AndroidChromeStrategy } from "../../../src/lib/strategies/android-chrome";
import { KitKatChromiumBasedWebViewStrategy } from "../../../src/lib/strategies/kitkat-chromium-based-webview";
import { NoopKeyboardStrategy as NoopStrategy } from "../../../src/lib/strategies/noop";
import {
  isIE9,
  isIos,
  isKitKatWebview,
  isAndroidChrome,
  isSamsungBrowser,
} from "../../../src/lib/device";

import { mocked } from "ts-jest/utils";

jest.mock("../../../src/lib/device");

describe("RestrictedInput", function () {
  afterEach(() => {
    // reset these back to their default mocked values
    mocked(isIE9).mockReturnValue(false);
    mocked(isIos).mockReturnValue(false);
    mocked(isKitKatWebview).mockReturnValue(false);
    mocked(isAndroidChrome).mockReturnValue(false);
    mocked(isSamsungBrowser).mockReturnValue(false);
  });

  describe("constructor()", function () {
    it("defaults to BaseStrategy", function () {
      const ri = new RestrictedInput({
        element: document.createElement("input"),
        pattern: "{{a}}",
      });

      expect(ri.strategy).toBeInstanceOf(BaseStrategy);
      expect(ri.strategy).not.toBeInstanceOf(IosStrategy);
      expect(ri.strategy).not.toBeInstanceOf(AndroidChromeStrategy);
    });

    it("sets isFormatted to `true` on initialization if input element has a value", function () {
      const element = document.createElement("input");

      element.value = "41111111";
      const ri = new RestrictedInput({
        element: element,
        pattern: "{{9999}} {{9999}}",
      });

      expect(ri.strategy.inputElement.value).toBe("4111 1111");
      expect(ri.strategy.isFormatted).toBe(true);
    });

    it("sets isFormatted to `false` on initialization if input element has no value", function () {
      const element = document.createElement("input");

      element.value = "";
      const ri = new RestrictedInput({
        element: element,
        pattern: "{{9999}} {{9999}}",
      });

      expect(ri.strategy.inputElement.value).toBe("");
      expect(ri.strategy.isFormatted).toBe(false);
    });

    it("uses IosStrategy for ios devices", function () {
      mocked(isIos).mockReturnValue(true);

      const ri = new RestrictedInput({
        element: document.createElement("input"),
        pattern: "{{a}}",
      });

      expect(ri.strategy).toBeInstanceOf(IosStrategy);
    });

    it("uses KitKatChromiumBasedWebViewStrategy for Android KitKiat webvies", function () {
      mocked(isKitKatWebview).mockReturnValue(true);

      const ri = new RestrictedInput({
        element: document.createElement("input"),
        pattern: "{{a}}",
      });

      expect(ri.strategy).toBeInstanceOf(KitKatChromiumBasedWebViewStrategy);
    });

    it("uses AndroidChromeStrategy for android chrome devices", function () {
      mocked(isAndroidChrome).mockReturnValue(true);

      const ri = new RestrictedInput({
        element: document.createElement("input"),
        pattern: "{{a}}",
      });

      expect(ri.strategy).toBeInstanceOf(AndroidChromeStrategy);
    });

    it("uses IE9Strategy for IE9 browser", function () {
      mocked(isIE9).mockReturnValue(true);

      const ri = new RestrictedInput({
        element: document.createElement("input"),
        pattern: "{{a}}",
      });

      expect(ri.strategy).toBeInstanceOf(IE9Strategy);
    });

    it("uses NoopStrategy for Samsung browser", function () {
      mocked(isSamsungBrowser).mockReturnValue(true);

      const ri = new RestrictedInput({
        element: document.createElement("input"),
        pattern: "{{a}}",
      });

      expect(ri.strategy).toBeInstanceOf(NoopStrategy);
    });
  });

  describe("getUnformattedValue()", function () {
    it("calls the strategy getUnformattedValue method", function () {
      const ri = new RestrictedInput({
        element: document.createElement("input"),
        pattern: "{{a}}",
      });

      jest.spyOn(ri.strategy, "getUnformattedValue");

      ri.getUnformattedValue();

      expect(ri.strategy.getUnformattedValue).toBeCalledTimes(1);
    });
  });

  describe("setPattern()", function () {
    it("calls the strategy setPattern method", function () {
      const ri = new RestrictedInput({
        element: document.createElement("input"),
        pattern: "{{a}}",
      });

      jest.spyOn(ri.strategy, "setPattern");

      ri.setPattern("{{1}}");

      expect(ri.strategy.setPattern).toBeCalledTimes(1);
      expect(ri.strategy.setPattern).toBeCalledWith("{{1}}");
    });
  });

  describe("supportsFormatting", function () {
    it("returns false if device is a samsung browser", function () {
      mocked(isSamsungBrowser).mockReturnValue(true);

      expect(RestrictedInput.supportsFormatting()).toBe(false);
    });

    it("returns true if device is not a Samsung browser", function () {
      mocked(isSamsungBrowser).mockReturnValue(false);

      expect(RestrictedInput.supportsFormatting()).toBe(true);
    });
  });
});
