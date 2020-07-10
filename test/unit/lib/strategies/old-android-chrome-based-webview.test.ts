import { AndroidChromeStrategy } from "../../../../src/lib/strategies/android-chrome";
import { KitKatChromiumBasedWebViewStrategy } from "../../../../src/lib/strategies/kitkat-chromium-based-webview";

describe("Old Android Chrome Based Webview Strategy", function () {
  describe("constructor()", function () {
    it("is an instance of AndroidChromeStrategy", function () {
      const options = {
        element: document.createElement("input"),
        pattern: "{{9}}",
      };
      const strategy = new KitKatChromiumBasedWebViewStrategy(options);

      expect(strategy).toBeInstanceOf(AndroidChromeStrategy);
    });
  });
});
