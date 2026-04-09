import { IE9Strategy } from "../../../../src/lib/strategies/ie9";
import { BaseStrategy } from "../../../../src/lib/strategies/base";
import { StrategyOptions } from "../../../../src/lib/strategies/strategy-interface";
import * as keyCannotMutateValueModule from "../../../../src/lib/key-cannot-mutate-value";
import { makeInput } from "./helpers";

// IE9Strategy tests use a focused input because setSelectionRange requires
// the element to be the active element.
function makeFocusedInput(value = ""): HTMLInputElement {
  return makeInput(value, true);
}

describe("IE9 Strategy", function () {
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
      const strategy = new IE9Strategy(options);

      expect(strategy).toBeInstanceOf(BaseStrategy);
    });

    it("adds IE9 specific listeners", function () {
      const strategy = new IE9Strategy(options);

      ["keydown", "paste", "focus"].forEach(function (event) {
        expect(strategy.inputElement.addEventListener).toHaveBeenCalledWith(
          event,
          expect.any(Function),
        );
      });
    });
  });

  describe("getUnformattedValue", function () {
    it("always returns the unformatted value", function () {
      const strategy = new IE9Strategy(options);

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

      const input = makeFocusedInput("4");
      const strategy = new IE9Strategy({ element: input, pattern: "{{9999}}" });

      const formatSpy = jest.spyOn(strategy as any, "format");
      input.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "ArrowLeft" }),
      );

      expect(formatSpy).not.toHaveBeenCalled();
    });

    it("calls simulateDeletion and formats on deletion key", function () {
      jest
        .spyOn(keyCannotMutateValueModule, "keyCannotMutateValue")
        .mockReturnValue(false);

      const input = makeFocusedInput("4");
      input.setSelectionRange(1, 1);
      const strategy = new IE9Strategy({ element: input, pattern: "{{9999}}" });

      const simulateDeletionSpy = jest
        .spyOn(strategy.formatter, "simulateDeletion")
        .mockReturnValue({ value: "", selection: { start: 0, end: 0 } });
      const formatSpy = jest.spyOn(strategy as any, "format");

      input.dispatchEvent(
        new KeyboardEvent("keydown", {
          bubbles: true,
          key: "Backspace",
          keyCode: 8,
        }),
      );

      expect(simulateDeletionSpy).toHaveBeenCalled();
      expect(formatSpy).toHaveBeenCalled();
    });

    it("constructs new value from inserted key and formats on normal key", function () {
      jest
        .spyOn(keyCannotMutateValueModule, "keyCannotMutateValue")
        .mockReturnValue(false);

      const input = makeFocusedInput("1");
      input.setSelectionRange(1, 1);
      // eslint-disable-next-line no-new
      new IE9Strategy({ element: input, pattern: "{{9999}}" });

      input.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "2" }),
      );

      // IE9Strategy manually builds the new value from the pressed key and formats it
      expect(input.value).toBe("12");
    });

    it("unformats stateToFormat when cursor is at end of new value", function () {
      jest
        .spyOn(keyCannotMutateValueModule, "keyCannotMutateValue")
        .mockReturnValue(false);

      const input = makeFocusedInput("1");
      // Cursor at end so insertion at end triggers unformat branch
      input.setSelectionRange(1, 1);
      const strategy = new IE9Strategy({ element: input, pattern: "{{9999}}" });

      const unformatSpy = jest
        .spyOn(strategy.formatter, "unformat")
        .mockReturnValue({
          value: "12",
          selection: { start: 2, end: 2 },
        });

      input.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "2" }),
      );

      // new value = "1" + "2" = "12", padded selection = {start:2, end:2},
      // selection.start (2) === newValue.length (2), so unformat is called with that state.
      expect(unformatSpy).toHaveBeenCalledWith({
        value: "12",
        selection: { start: 2, end: 2 },
      });
    });
  });

  describe("focus listener", function () {
    it("formats the input on focus", function () {
      const input = makeFocusedInput("4111");
      const strategy = new IE9Strategy({ element: input, pattern: "{{9999}}" });

      strategy.isFormatted = false;
      const formatSpy = jest.spyOn(strategy as any, "format");

      input.dispatchEvent(new Event("focus", { bubbles: true }));

      expect(formatSpy).toHaveBeenCalled();
    });
  });

  describe("reformatAfterPaste()", function () {
    it("formats value and defers selection via setTimeout", function () {
      jest.useFakeTimers();

      const input = makeFocusedInput("4111");
      input.setSelectionRange(2, 2);
      const strategy = new IE9Strategy({ element: input, pattern: "{{9999}}" });

      jest.spyOn(input, "setSelectionRange");

      (strategy as any).reformatAfterPaste();

      jest.runAllTimers();

      // reformatAfterPaste pads the original selection by 1 before deferring it,
      // so selection {start:2, end:2} becomes {start:3, end:3}.
      expect(input.setSelectionRange).toHaveBeenLastCalledWith(3, 3);

      jest.useRealTimers();
    });
  });
});
