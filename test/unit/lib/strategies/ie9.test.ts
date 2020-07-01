import { IE9Strategy } from "../../../../src/lib/strategies/ie9";
import { BaseStrategy } from "../../../../src/lib/strategies/base";
import { StrategyOptions } from "../../../../src/lib/strategies/strategy-interface";

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
        expect(strategy.inputElement.addEventListener).toBeCalledWith(
          event,
          expect.any(Function)
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
});
