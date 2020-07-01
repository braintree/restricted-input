import { IosStrategy } from "../../../../src/lib/strategies/ios";
import { BaseStrategy } from "../../../../src/lib/strategies/base";
import { StrategyOptions } from "../../../../src/lib/strategies/strategy-interface";

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

      ["keydown", "input", "focus"].forEach(function (event) {
        expect(strategy.inputElement.addEventListener).toBeCalledWith(
          event,
          expect.any(Function)
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
});
