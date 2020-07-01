import { AndroidChromeStrategy } from "../../../../src/lib/strategies/android-chrome";
import { BaseStrategy } from "../../../../src/lib/strategies/base";

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
  });
});
