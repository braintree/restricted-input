import device from "./lib/device";

export = function (): boolean {
  // Digits get dropped in samsung browser
  return !device.isSamsungBrowser();
};
