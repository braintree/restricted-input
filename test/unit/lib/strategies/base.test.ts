import { BaseStrategy } from "../../../../src/lib/strategies/base";
import { StrategyOptions } from "../../../../src/lib/strategies/strategy-interface";
import * as keyCannotMutateValueModule from "../../../../src/lib/key-cannot-mutate-value";
import { makeInput, fireEvent } from "./helpers";

describe("Base Strategy", function () {
  let options: StrategyOptions;

  beforeEach(function () {
    const input = document.createElement("input");
    input.value = "input value";
    jest.spyOn(input, "addEventListener").mockImplementation();

    options = {
      element: input,
      pattern: "{{CCCCC}} {{CCCCC}}",
    };
  });

  describe("constructor()", function () {
    it("adds input listeners", function () {
      const strategy = new BaseStrategy(options);

      ["keydown", "keypress", "keyup", "input", "paste"].forEach(
        function (event) {
          expect(strategy.inputElement.addEventListener).toHaveBeenCalledWith(
            event,
            expect.any(Function),
          );
        },
      );
    });
  });

  describe("getUnformattedValue()", function () {
    it("returns the value if already unformatted", function () {
      const strategy = new BaseStrategy(options);

      expect(strategy.inputElement.value).toBe("input value");
      expect(strategy.getUnformattedValue()).toBe("inputvalue");
    });

    it("returns the unformatted value if formatted", function () {
      const strategy = new BaseStrategy(options);

      strategy.isFormatted = true;
      jest.spyOn(strategy.formatter, "unformat").mockReturnValue({
        selection: { start: 0, end: 0 },
        value: "unformatted value",
      });

      expect(strategy.getUnformattedValue()).toBe("unformatted value");
    });

    it("returns the unformatted value if unformatted but force is set to true", function () {
      const strategy = new BaseStrategy(options);

      strategy.isFormatted = false;
      jest.spyOn(strategy.formatter, "unformat").mockReturnValue({
        selection: { start: 0, end: 0 },
        value: "unformatted value",
      });

      expect(strategy.getUnformattedValue(true)).toBe("unformatted value");
    });
  });

  describe("event handlers", function () {
    describe("keydown handler", function () {
      it("returns early without reformatting when keyCannotMutateValue is true", function () {
        jest
          .spyOn(keyCannotMutateValueModule, "keyCannotMutateValue")
          .mockReturnValue(true);
        const input = makeInput("4111");
        // eslint-disable-next-line no-new
        new BaseStrategy({
          element: input,
          pattern: "{{9999}}",
        });
        const originalValue = input.value;

        fireEvent(input, "keydown", { key: "ArrowLeft" });

        expect(input.value).toBe(originalValue);
      });

      it("unformats input on deletion key", function () {
        const input = makeInput("4111");
        const strategy = new BaseStrategy({
          element: input,
          pattern: "{{9999}}",
        });
        strategy.isFormatted = true;

        jest
          .spyOn(keyCannotMutateValueModule, "keyCannotMutateValue")
          .mockReturnValue(false);

        fireEvent(input, "keydown", { key: "Backspace" });

        expect(strategy.isFormatted).toBe(false);
      });

      it("marks isFormatted false when simulated event fires (no key or keyCode)", function () {
        // keyCannotMutateValue returns false for key="" / keyCode=0 (hits default branch),
        // so execution continues past the early-return. Mock it explicitly so this test
        // is not sensitive to changes in that utility.
        jest
          .spyOn(keyCannotMutateValueModule, "keyCannotMutateValue")
          .mockReturnValue(false);

        const input = makeInput("4111");
        const strategy = new BaseStrategy({
          element: input,
          pattern: "{{9999}}",
        });
        strategy.isFormatted = true;

        // Simulated event: key='' and keyCode=0 — both falsy, so isSimulatedEvent() is true
        const event = new KeyboardEvent("keydown", {
          bubbles: true,
          key: "",
          keyCode: 0,
        });
        input.dispatchEvent(event);

        expect(strategy.isFormatted).toBe(false);
      });
    });

    describe("keypress handler", function () {
      it("calls unformatInput via onKeypress", function () {
        jest
          .spyOn(keyCannotMutateValueModule, "keyCannotMutateValue")
          .mockReturnValue(false);
        const input = makeInput("4111");
        const strategy = new BaseStrategy({
          element: input,
          pattern: "{{9999}}",
        });
        strategy.isFormatted = true;

        fireEvent(input, "keypress", { key: "a" });

        expect(strategy.isFormatted).toBe(false);
      });
    });

    describe("keyup handler", function () {
      it("reformats input", function () {
        const input = makeInput("4111");
        const strategy = new BaseStrategy({
          element: input,
          pattern: "{{9999}}",
        });
        strategy.isFormatted = false;

        fireEvent(input, "keyup");

        expect(strategy.isFormatted).toBe(true);
      });
    });

    describe("input handler", function () {
      it("calls reformatInput when hasKeypressEvent is false (autofill path)", function () {
        const input = makeInput("4111");
        const strategy = new BaseStrategy({
          element: input,
          pattern: "{{9999}}",
        });
        strategy.isFormatted = false;

        // Fire input without a preceding keypress so hasKeypressEvent stays false
        fireEvent(input, "input");

        expect(strategy.isFormatted).toBe(true);
      });

      it("resets isFormatted to false for CustomEvent before reformatting", function () {
        const input = makeInput("4111");
        const strategy = new BaseStrategy({
          element: input,
          pattern: "{{9999}}",
        });
        strategy.isFormatted = true;

        // Intercept reformatInput to capture isFormatted at the moment it is called.
        // This is the only observable point where the reset-to-false is visible,
        // since reformatInput immediately sets it back to true.
        let isFormattedWhenReformatCalled: boolean | undefined;
        jest
          .spyOn(strategy as any, "reformatInput")
          .mockImplementation(function () {
            isFormattedWhenReformatCalled = strategy.isFormatted;
          });

        input.dispatchEvent(new CustomEvent("input", { bubbles: true }));

        expect(isFormattedWhenReformatCalled).toBe(false);
      });

      it("resets isFormatted to false for untrusted non-CustomEvent (e.g. LastPass) before reformatting", function () {
        const input = makeInput("4111");
        const strategy = new BaseStrategy({
          element: input,
          pattern: "{{9999}}",
        });
        strategy.isFormatted = true;

        // jsdom always sets isTrusted=false on synthetic events (non-configurable),
        // so a plain Event exercises the !event.isTrusted branch in the handler.
        // Intercept reformatInput to observe isFormatted before it is reset to true.
        let isFormattedWhenReformatCalled: boolean | undefined;
        jest
          .spyOn(strategy as any, "reformatInput")
          .mockImplementation(function () {
            isFormattedWhenReformatCalled = strategy.isFormatted;
          });

        input.dispatchEvent(new Event("input", { bubbles: true }));

        expect(isFormattedWhenReformatCalled).toBe(false);
      });
    });

    describe("paste handler (pasteEventHandler)", function () {
      it("reads clipboard data and splices into current value", function () {
        const input = makeInput("12");
        input.setSelectionRange(2, 2);

        const onPasteEvent = jest.fn();
        const strategy = new BaseStrategy({
          element: input,
          pattern: "{{9999}}",
          onPasteEvent,
        });

        // Call pasteEventHandler directly with a fake ClipboardEvent-like object
        const fakeEvent = {
          preventDefault: jest.fn(),
          clipboardData: { getData: jest.fn().mockReturnValue("34") },
        } as unknown as ClipboardEvent;

        (strategy as any).pasteEventHandler(fakeEvent);

        expect(onPasteEvent).toHaveBeenCalledWith({
          unformattedInputValue: expect.stringContaining("34"),
        });
        expect(input.value).toContain("34");
      });

      it("falls back to window.clipboardData when event.clipboardData is absent", function () {
        const input = makeInput("12");
        input.setSelectionRange(2, 2);

        const onPasteEvent = jest.fn();
        const strategy = new BaseStrategy({
          element: input,
          pattern: "{{9999}}",
          onPasteEvent,
        });

        // Simulate IE: no event.clipboardData, but window.clipboardData exists
        (window as any).clipboardData = {
          getData: jest.fn().mockReturnValue("56"),
        };

        const fakeEvent = {
          preventDefault: jest.fn(),
          clipboardData: null,
        } as unknown as ClipboardEvent;

        (strategy as any).pasteEventHandler(fakeEvent);

        expect(onPasteEvent).toHaveBeenCalledWith({
          unformattedInputValue: expect.stringContaining("56"),
        });

        // Cleanup
        (window as any).clipboardData = undefined;
      });

      it("dispatches paste event listener through the input element", function () {
        const input = makeInput("12");
        const strategy = new BaseStrategy({
          element: input,
          pattern: "{{9999}}",
        });

        const pasteHandlerSpy = jest.spyOn(
          strategy as any,
          "pasteEventHandler",
        );
        // Use a plain Event dispatched as "paste" — the listener will call pasteEventHandler
        const event = new Event("paste", { bubbles: true });
        input.dispatchEvent(event);

        expect(pasteHandlerSpy).toHaveBeenCalled();
      });
    });
  });

  describe("setPattern()", function () {
    it("sets a new pattern", function () {
      const strategy = new BaseStrategy(options);
      const oldFormatter = strategy.formatter;

      strategy.setPattern("{{111}}");

      expect(strategy.formatter).not.toBe(oldFormatter);
    });

    it("reformats input if it is not empty", function () {
      const strategy = new BaseStrategy(options);

      strategy.setPattern("{{aa}}x-1{{aa}}");

      expect(strategy.inputElement.value).toBe("inx-1pu");
    });

    it("does not reformat input if it is empty", function () {
      const strategy = new BaseStrategy(options);

      strategy.inputElement.value = "";
      strategy.setPattern("{{aa}}x-1{{aa}}");

      expect(strategy.inputElement.value).toBe("");
    });
  });
});
