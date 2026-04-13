import { AndroidChromeStrategy } from "../../../../src/lib/strategies/android-chrome";
import { BaseStrategy } from "../../../../src/lib/strategies/base";
import * as keyCannotMutateValueModule from "../../../../src/lib/key-cannot-mutate-value";
import { makeInput as makeInputBase } from "./helpers";

function makeInput(value = ""): HTMLInputElement {
  return makeInputBase(value, true);
}

describe("Android Chrome Strategy", function () {
  describe("constructor()", function () {
    it("is an instance of BaseStrategy", function () {
      const options = {
        element: document.createElement("input"),
        pattern: "{{9}}",
      };
      const strategy = new AndroidChromeStrategy(options);

      expect(strategy).toBeInstanceOf(BaseStrategy);
    });

    it("adds android-chrome specific listeners", function () {
      const input = document.createElement("input");
      jest.spyOn(input, "addEventListener");
      const strategy = new AndroidChromeStrategy({
        element: input,
        pattern: "{{9}}",
      });

      ["keydown", "keyup", "input", "paste"].forEach((event) => {
        expect(strategy.inputElement.addEventListener).toHaveBeenCalledWith(
          event,
          expect.any(Function),
        );
      });
    });
  });

  describe("keydown handler", function () {
    it("unformats input when key can mutate value", function () {
      jest
        .spyOn(keyCannotMutateValueModule, "keyCannotMutateValue")
        .mockReturnValue(false);

      const input = makeInput("4111");
      const strategy = new AndroidChromeStrategy({
        element: input,
        pattern: "{{9999}}",
      });
      strategy.isFormatted = true;

      input.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "1" }),
      );

      expect(strategy.isFormatted).toBe(false);
    });

    it("does not unformat when keyCannotMutateValue is true", function () {
      jest
        .spyOn(keyCannotMutateValueModule, "keyCannotMutateValue")
        .mockReturnValue(true);

      const input = makeInput("4111");
      const strategy = new AndroidChromeStrategy({
        element: input,
        pattern: "{{9999}}",
      });
      strategy.isFormatted = true;

      input.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "ArrowLeft" }),
      );

      expect(strategy.isFormatted).toBe(true);
    });
  });

  describe("keyup handler", function () {
    it("calls reformatInput", function () {
      const input = makeInput("4111");
      const strategy = new AndroidChromeStrategy({
        element: input,
        pattern: "{{9999}}",
      });
      strategy.isFormatted = false;

      input.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true }));

      expect(strategy.isFormatted).toBe(true);
    });
  });

  describe("input handler", function () {
    it("calls reformatInput", function () {
      const input = makeInput("4111");
      const strategy = new AndroidChromeStrategy({
        element: input,
        pattern: "{{9999}}",
      });
      strategy.isFormatted = false;

      input.dispatchEvent(new Event("input", { bubbles: true }));

      expect(strategy.isFormatted).toBe(true);
    });
  });

  describe("prePasteEventHandler()", function () {
    it("is a noop and does not call event.preventDefault", function () {
      const input = makeInput("12");
      const strategy = new AndroidChromeStrategy({
        element: input,
        pattern: "{{9999}}",
      });

      // Call prePasteEventHandler directly with a fake event
      const fakeEvent = {
        preventDefault: jest.fn(),
      } as unknown as ClipboardEvent;
      (strategy as any).prePasteEventHandler(fakeEvent);

      expect(fakeEvent.preventDefault).not.toHaveBeenCalled();
    });
  });

  describe("postPasteEventHandler()", function () {
    it("calls reformatAfterPaste inside a setTimeout", function () {
      jest.useFakeTimers();

      const input = makeInput("12");
      input.setSelectionRange(2, 2);
      const strategy = new AndroidChromeStrategy({
        element: input,
        pattern: "{{9999}}",
      });

      const reformatSpy = jest.spyOn(strategy as any, "reformatAfterPaste");

      // Trigger postPasteEventHandler directly
      (strategy as any).postPasteEventHandler();

      expect(reformatSpy).not.toHaveBeenCalled();

      jest.runAllTimers();

      expect(reformatSpy).toHaveBeenCalledTimes(1);

      jest.useRealTimers();
    });
  });

  describe("afterReformatInput()", function () {
    it("resets selection to formatted end position inside a setTimeout", function () {
      jest.useFakeTimers();

      const input = makeInput("4111");
      input.setSelectionRange(0, 0);
      const strategy = new AndroidChromeStrategy({
        element: input,
        pattern: "{{9999}}",
      });

      jest.spyOn(input, "setSelectionRange");

      const formattedState = {
        value: "4111",
        selection: { start: 4, end: 4 },
      };

      (strategy as any).afterReformatInput(formattedState);

      expect(input.setSelectionRange).not.toHaveBeenCalled();

      jest.runAllTimers();

      expect(input.setSelectionRange).toHaveBeenCalledWith(4, 4);

      jest.useRealTimers();
    });
  });
});
