import { IosStrategy } from "../../../../src/lib/strategies/ios";
import { BaseStrategy } from "../../../../src/lib/strategies/base";
import { StrategyOptions } from "../../../../src/lib/strategies/strategy-interface";
import * as keyCannotMutateValueModule from "../../../../src/lib/key-cannot-mutate-value";
import { makeInput as makeInputBase } from "./helpers";

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
