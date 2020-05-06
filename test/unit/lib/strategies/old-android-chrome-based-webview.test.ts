const AndroidChromeStrategy = require("../../../../lib/strategies/android-chrome");
const KitKatChromiumBasedWebViewStrategy = require("../../../../lib/strategies/kitkat-chromium-based-webview");

describe("Old Android Chrome Based Webview Strategy", function () {
  describe("constructor()", function () {
    it("is an instance of AndroidChromeStrategy", function () {
      const options = {
        element: {
          value: "input value",
          addEventListener: jest.fn(),
        },
        pattern: "{{9}}",
      };
      const strategy = new KitKatChromiumBasedWebViewStrategy(options);

      expect(strategy).toBeInstanceOf(AndroidChromeStrategy);
    });
  });
});
