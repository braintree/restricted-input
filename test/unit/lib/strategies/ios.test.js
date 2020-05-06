const IosStrategy = require("../../../../lib/strategies/ios");
const BaseStrategy = require("../../../../lib/strategies/base");

describe("iOS Strategy", function () {
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

      jest
        .spyOn(strategy.formatter, "unformat")
        .mockReturnValue({ value: "unformatted value" });

      expect(strategy.getUnformattedValue()).toBe("unformatted value");
    });
  });
});