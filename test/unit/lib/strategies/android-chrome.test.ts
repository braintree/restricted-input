const AndroidChromeStrategy = require("../../../../lib/strategies/android-chrome");
const BaseStrategy = require("../../../../lib/strategies/base");

describe("Android Chrome Strategy", function () {
  describe("constructor()", function () {
    it("is an instance of BaseStrategy", function () {
      const options = {
        element: {
          value: "input value",
          addEventListener: jest.fn(),
        },
        pattern: "{{9}}",
      };
      const strategy = new AndroidChromeStrategy(options);

      expect(strategy).toBeInstanceOf(BaseStrategy);
    });
  });
});
