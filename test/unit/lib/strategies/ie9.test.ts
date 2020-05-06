const IE9Strategy = require("../../../../lib/strategies/ie9");
const BaseStrategy = require("../../../../lib/strategies/base");

describe("IE9 Strategy", function () {
  let options;

  beforeEach(function () {
    options = {
      element: {
        value: "input value",
        addEventListener: jest.fn(),
      },
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

      jest
        .spyOn(strategy.formatter, "unformat")
        .mockReturnValue({ value: "unformatted value" });

      expect(strategy.getUnformattedValue()).toBe("unformatted value");
    });
  });
});
