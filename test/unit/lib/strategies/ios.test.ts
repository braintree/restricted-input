import { IosStrategy } from "../../../../src/lib/strategies/ios";
import { BaseStrategy } from "../../../../src/lib/strategies/base";
import { StrategyOptions } from "../../../../src/lib/strategies/strategy-interface";
import * as keyCannotMutateValueModule from "../../../../src/lib/key-cannot-mutate-value";
import { makeInput as makeInputBase, fireEvent } from "./helpers";

function makeInput(value = ""): HTMLInputElement {
  return makeInputBase(value, true);
}

describe("iOS Strategy", function () {
  let options: StrategyOptions;

  beforeEach(function () {
    const input = document.createElement("input");
    jest.spyOn(input, "addEventListener");
    options = {
      element: input,
      pattern: "{{9}}",
    };
  });

  describe("constructor()", function () {
    it("is an instance of BaseStrategy", function () {
      const strategy = new IosStrategy(options);

      expect(strategy).toBeInstanceOf(BaseStrategy);
    });

    it("adds ios specific listeners", function () {
      const strategy = new IosStrategy(options);

      ["keydown", "input"].forEach(function (event) {
        expect(strategy.inputElement.addEventListener).toHaveBeenCalledWith(
          event,
          expect.any(Function),
        );
      });
    });
  });

  describe("getUnformattedValue", function () {
    it("always returns the unformatted value", function () {
      const strategy = new IosStrategy(options);

      jest.spyOn(strategy.formatter, "unformat").mockReturnValue({
        selection: { start: 0, end: 0 },
        value: "unformatted value",
      });

      expect(strategy.getUnformattedValue()).toBe("unformatted value");
    });
  });

  describe("keydown listener", function () {
    it("returns early when keyCannotMutateValue is true", function () {
      jest
        .spyOn(keyCannotMutateValueModule, "keyCannotMutateValue")
        .mockReturnValue(true);

      const input = makeInput("4");
      const strategy = new IosStrategy({ element: input, pattern: "{{9999}}" });

      input.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "ArrowLeft" }),
      );

      // stateToFormat should not be set when returning early
      expect((strategy as any).stateToFormat).toBeUndefined();
    });

    it("calls simulateDeletion and sets stateToFormat on deletion key", function () {
      jest
        .spyOn(keyCannotMutateValueModule, "keyCannotMutateValue")
        .mockReturnValue(false);

      const input = makeInput("4");
      input.setSelectionRange(1, 1);
      const strategy = new IosStrategy({ element: input, pattern: "{{9999}}" });

      const mockState = { value: "", selection: { start: 0, end: 0 } };
      const simulateSpy = jest
        .spyOn(strategy.formatter, "simulateDeletion")
        .mockReturnValue(mockState);

      input.dispatchEvent(
        new KeyboardEvent("keydown", {
          bubbles: true,
          key: "Backspace",
          keyCode: 8,
        }),
      );

      expect(simulateSpy).toHaveBeenCalled();
      expect((strategy as any).stateToFormat).toBe(mockState);
    });

    it("does not set stateToFormat for non-deletion key", function () {
      jest
        .spyOn(keyCannotMutateValueModule, "keyCannotMutateValue")
        .mockReturnValue(false);

      const input = makeInput("4");
      const strategy = new IosStrategy({ element: input, pattern: "{{9999}}" });

      input.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "5" }),
      );

      expect((strategy as any).stateToFormat).toBeUndefined();
    });
  });

  describe("input listener", function () {
    it("formats input on normal input event", function () {
      const input = makeInput("4");
      const strategy = new IosStrategy({ element: input, pattern: "{{9999}}" });

      strategy.isFormatted = false;
      const formatListenerSpy = jest.spyOn(strategy as any, "formatListener");

      input.dispatchEvent(new Event("input", { bubbles: true }));

      expect(formatListenerSpy).toHaveBeenCalled();
    });

    it("sets stateToFormat from current value on CustomEvent (Safari AutoFill)", function () {
      const input = makeInput("4111111111111111");
      // eslint-disable-next-line no-new
      new IosStrategy({
        element: input,
        pattern: "{{9999}} {{9999}} {{9999}} {{9999}}",
      });

      const customEvent = new CustomEvent("input", { bubbles: true });
      input.dispatchEvent(customEvent);

      // stateToFormat is set then consumed by formatListener, so value should be formatted
      expect(input.value).toBe("4111 1111 1111 1111");
    });

    it("calls fixLeadingBlankSpaceOnIos for non-CustomEvent", function () {
      const input = makeInput("");
      const strategy = new IosStrategy({ element: input, pattern: "{{9999}}" });

      const fixSpy = jest.spyOn(strategy as any, "fixLeadingBlankSpaceOnIos");

      input.dispatchEvent(new Event("input", { bubbles: true }));

      expect(fixSpy).toHaveBeenCalled();
    });

    it("does NOT call fixLeadingBlankSpaceOnIos for CustomEvent", function () {
      const input = makeInput("4");
      const strategy = new IosStrategy({ element: input, pattern: "{{9999}}" });

      const fixSpy = jest.spyOn(strategy as any, "fixLeadingBlankSpaceOnIos");

      input.dispatchEvent(new CustomEvent("input", { bubbles: true }));

      expect(fixSpy).not.toHaveBeenCalled();
    });
  });

  describe("issue #775 - iOS Chrome Wallet autofill", function () {
    it("keeps all 16 digits when iOS Chrome re-sets the raw number wholesale", function () {
      const input = makeInput("4111111111111111");
      const strategy = new IosStrategy({
        element: input,
        pattern: "{{9999}} {{9999}} {{9999}} {{9999}}",
      });

      expect(input.value).toBe("4111 1111 1111 1111");

      // Chrome's autofill overwrite: a keydown with no key info, then the write.
      fireEvent(input, "keydown", { key: "", keyCode: 0 });
      input.value = "4111111111111111";
      input.setSelectionRange(input.value.length, input.value.length);
      fireEvent(input, "input");

      expect(input.value).toBe("4111 1111 1111 1111");
      expect(strategy.getUnformattedValue()).toBe("4111111111111111");
    });

    it("does not treat a real keystroke as a wholesale write", function () {
      const input = makeInput("411");
      const strategy = new IosStrategy({
        element: input,
        pattern: "{{9999}} {{9999}} {{9999}} {{9999}}",
      });

      input.setSelectionRange(3, 3);
      fireEvent(input, "keydown", { key: "1" });
      input.value = "4111";
      input.setSelectionRange(4, 4);
      fireEvent(input, "input");

      expect(input.value).toBe("4111 ");
      expect(strategy.getUnformattedValue()).toBe("4111");
    });

    it("does not let a non-mutating keydown (e.g. arrow key) block wholesale-write detection", function () {
      const input = makeInput("4111111111111111");
      const strategy = new IosStrategy({
        element: input,
        pattern: "{{9999}} {{9999}} {{9999}} {{9999}}",
      });

      fireEvent(input, "keydown", { key: "ArrowLeft" });

      input.value = "4111111111111111";
      input.setSelectionRange(input.value.length, input.value.length);
      fireEvent(input, "input");

      expect(input.value).toBe("4111 1111 1111 1111");
      expect(strategy.getUnformattedValue()).toBe("4111111111111111");
    });

    it("still formats a real backspace correctly after a prior wholesale write", function () {
      const input = makeInput("4111111111111111");
      const strategy = new IosStrategy({
        element: input,
        pattern: "{{9999}} {{9999}} {{9999}} {{9999}}",
      });

      input.value = "4111111111111111";
      input.setSelectionRange(input.value.length, input.value.length);
      fireEvent(input, "input");
      expect(input.value).toBe("4111 1111 1111 1111");

      input.setSelectionRange(19, 19);
      fireEvent(input, "keydown", { key: "Backspace", keyCode: 8 });
      fireEvent(input, "input");

      expect(strategy.getUnformattedValue()).toBe("411111111111111");
    });

    it("does not reset the cursor to the start of the field on a touch paste with no preceding keydown", function () {
      const input = makeInput("");
      const strategy = new IosStrategy({
        element: input,
        pattern: "{{9999}} {{9999}} {{9999}} {{9999}}",
      });

      input.setSelectionRange(0, 0);

      const pasteEvent = new Event("paste", {
        bubbles: true,
        cancelable: true,
      });

      Object.defineProperty(pasteEvent, "clipboardData", {
        value: { getData: () => "4111111111111111" },
      });

      input.dispatchEvent(pasteEvent);

      expect(input.value).toBe("4111 1111 1111 1111");
      expect(input.selectionStart).toBe(19);
      expect(input.selectionEnd).toBe(19);
      expect(strategy.getUnformattedValue()).toBe("4111111111111111");
    });

    it("does not double-format the value a paste already formatted", function () {
      const input = makeInput("");
      const strategy = new IosStrategy({
        element: input,
        pattern: "--{{9}}x{{a}}z",
      });

      input.setSelectionRange(0, 0);

      const pasteEvent = new Event("paste", {
        bubbles: true,
        cancelable: true,
      });

      Object.defineProperty(pasteEvent, "clipboardData", {
        value: { getData: () => "8b" },
      });

      input.dispatchEvent(pasteEvent);

      expect(input.value).toBe("--8xbz");
      expect(strategy.getUnformattedValue()).toBe("8b");
    });

    it("does not double-format a paste that replaces part of an already-formatted value", function () {
      const input = makeInput("");
      const strategy = new IosStrategy({
        element: input,
        pattern: "--{{9}}x{{a}}z",
      });

      input.setSelectionRange(0, 0);
      const firstPaste = new Event("paste", {
        bubbles: true,
        cancelable: true,
      });

      Object.defineProperty(firstPaste, "clipboardData", {
        value: { getData: () => "8b" },
      });
      input.dispatchEvent(firstPaste);
      expect(input.value).toBe("--8xbz");

      // Replace just the digit, leaving "xbz" trailing after the edit point
      // so the cursor doesn't land at the end of the field.
      input.setSelectionRange(2, 3);
      const secondPaste = new Event("paste", {
        bubbles: true,
        cancelable: true,
      });

      Object.defineProperty(secondPaste, "clipboardData", {
        value: { getData: () => "9" },
      });
      input.dispatchEvent(secondPaste);

      expect(input.value).toBe("--9xbz");
      expect(strategy.getUnformattedValue()).toBe("9b");
    });

    it("resets hasKeydownEvent on keyup even if no input event follows the keydown", function () {
      const input = makeInput("4111111111111111");
      const strategy = new IosStrategy({
        element: input,
        pattern: "{{9999}} {{9999}} {{9999}} {{9999}}",
      });

      // A keystroke that never produces a matching input event (e.g. blocked
      // by maxlength).
      fireEvent(input, "keydown", { key: "1" });
      fireEvent(input, "keyup", { key: "1" });

      input.value = "4111111111111111";
      input.setSelectionRange(input.value.length, input.value.length);
      fireEvent(input, "input");

      expect(input.value).toBe("4111 1111 1111 1111");
      expect(strategy.getUnformattedValue()).toBe("4111111111111111");
    });

    it("does not leave wholesale-write detection disabled after a paste completes", function () {
      const input = makeInput("");
      const strategy = new IosStrategy({
        element: input,
        pattern: "{{9999}} {{9999}} {{9999}} {{9999}}",
      });

      input.setSelectionRange(0, 0);
      const pasteEvent = new Event("paste", {
        bubbles: true,
        cancelable: true,
      });

      Object.defineProperty(pasteEvent, "clipboardData", {
        value: { getData: () => "41111111" },
      });
      input.dispatchEvent(pasteEvent);
      expect(input.value).toBe("4111 1111 ");

      // A later, unrelated wholesale write should still be detected.
      input.value = "4111111111111111";
      input.setSelectionRange(input.value.length, input.value.length);
      fireEvent(input, "input");

      expect(input.value).toBe("4111 1111 1111 1111");
      expect(strategy.getUnformattedValue()).toBe("4111111111111111");
    });

    it("does not corrupt the value on a native touch-menu cut with no keydown", function () {
      const input = makeInput("8b");
      const strategy = new IosStrategy({
        element: input,
        pattern: "--{{9}}x{{a}}",
      });

      expect(input.value).toBe("--8xb");

      // Native Cut: the browser removes the selection and fires a real
      // InputEvent with inputType set, no keydown.
      input.value = "--8x";
      input.setSelectionRange(4, 4);
      input.dispatchEvent(
        new InputEvent("input", { bubbles: true, inputType: "deleteByCut" }),
      );

      expect(input.value).toBe("--8x");
      expect(strategy.getUnformattedValue()).toBe("8");
    });
  });

  describe("fixLeadingBlankSpaceOnIos()", function () {
    it("sets value to empty string in a setTimeout when value is empty", function () {
      jest.useFakeTimers();

      const input = makeInput("");
      const strategy = new IosStrategy({ element: input, pattern: "{{9999}}" });

      (strategy as any).fixLeadingBlankSpaceOnIos();

      // Before timer runs, value is still ""
      input.value = "  "; // simulate blank space iOS cursor issue

      jest.runAllTimers();

      expect(input.value).toBe("");

      jest.useRealTimers();
    });

    it("does not run the setTimeout when value is not empty", function () {
      jest.useFakeTimers();

      const input = makeInput("4");
      const strategy = new IosStrategy({ element: input, pattern: "{{9999}}" });

      // Manually invoke with non-empty value
      input.value = "4";
      (strategy as any).fixLeadingBlankSpaceOnIos();

      // No timer should have been scheduled — check before running timers so
      // we assert on the scheduling decision, not just side-effects.
      expect(jest.getTimerCount()).toBe(0);

      jest.useRealTimers();
    });
  });
});
