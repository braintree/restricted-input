// Android Devices on KitKat use Chromium based webviews. For some reason,
// the value of the inputs are not accessible in the event loop where the
// key event listeners are called. This causes formatting to get stuck
// on permacharacters. By putting them in setTimeouts, this fixes the
// problem. This causes other problems in non-webviews, so we give it
// its own strategy.

import AndroidChromeStrategy from "./android-chrome";

class KitKatChromiumBasedWebViewStrategy extends AndroidChromeStrategy {
  _reformatInput() {
    setTimeout(() => {
      super._reformatInput();
    }, 0);
  }

  _unformatInput() {
    setTimeout(() => {
      super._unformatInput();
    }, 0);
  }
}

export default KitKatChromiumBasedWebViewStrategy;
