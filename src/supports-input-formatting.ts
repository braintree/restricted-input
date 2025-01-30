import { isSamsungBrowser } from "./lib/device";

export = function supportsInputFormatting(): boolean {
  // Digits get dropped in samsung browser
  return !isSamsungBrowser();
};
