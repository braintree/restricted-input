import { AndroidChromeStrategy } from "../../../../src/lib/strategies/android-chrome";
import { KitKatChromiumBasedWebViewStrategy } from "../../../../src/lib/strategies/kitkat-chromium-based-webview";
import { makeInput as makeInputBase } from "./helpers";

function makeInput(value = ""): HTMLInputElement {
  return makeInputBase(value, true);
}

describe("Old Android Chrome Based Webview Strategy", function () {
  describe("constructor()", function () {
    it("is an instance of AndroidChromeStrategy", function () {
      const options = {
        element: document.createElement("input"),
        pattern: "{{9}}",
      };
      const strategy = new KitKatChromiumBasedWebViewStrategy(options);

      expect(strategy).toBeInstanceOf(AndroidChromeStrategy);
    });
  });

  describe("reformatInput()", function () {
    it("wraps super.reformatInput() in a setTimeout", function () {
      jest.useFakeTimers();

      const input = makeInput("4111");
      const strategy = new KitKatChromiumBasedWebViewStrategy({
        element: input,
        pattern: "{{9999}}",
      });

      // Reset so we can detect the reformat
      strategy.isFormatted = false;

      // Call reformatInput — it should NOT reformat immediately
      (strategy as any).reformatInput();

      expect(strategy.isFormatted).toBe(false);

      jest.runAllTimers();

      expect(strategy.isFormatted).toBe(true);

      jest.useRealTimers();
    });
  });

  describe("unformatInput()", function () {
    it("wraps super.unformatInput() in a setTimeout", function () {
      jest.useFakeTimers();

      // Use a value with a format character so input.value is a concrete
      // observable: "4111 1111" (formatted) → "41111111" (unformatted).
      const input = makeInput("4111 1111");
      const strategy = new KitKatChromiumBasedWebViewStrategy({
        element: input,
        pattern: "{{9999}} {{9999}}",
      });

      strategy.isFormatted = true;

      // Call unformatInput — it should NOT unformat immediately
      (strategy as any).unformatInput();

      expect(strategy.isFormatted).toBe(true);
      expect(input.value).toBe("4111 1111"); // value unchanged synchronously

      jest.runAllTimers();

      expect(strategy.isFormatted).toBe(false);
      expect(input.value).toBe("41111111"); // format character removed asynchronously

      jest.useRealTimers();
    });
  });
});
