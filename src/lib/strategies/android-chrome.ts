import keyCannotMutateValue from "../key-cannot-mutate-value";
import BaseStrategy from "./base";
import { Formatted } from "../formatter";
import { set as setSelection } from "../input-selection";

class AndroidChromeStrategy extends BaseStrategy {
  _attachListeners() {
    this.inputElement.addEventListener("keydown", (event) => {
      if (keyCannotMutateValue(event as KeyboardEvent)) {
        return;
      }
      this._unformatInput();
    });

    // 'keypress' is not fired with some Android keyboards (see #23)
    this.inputElement.addEventListener("keypress", (event) => {
      if (keyCannotMutateValue(event as KeyboardEvent)) {
        return;
      }
      this._unformatInput();
    });

    this.inputElement.addEventListener("keyup", (event) => {
      this._reformatInput();
    });

    this.inputElement.addEventListener("input", (event) => {
      this._reformatInput();
    });

    this.inputElement.addEventListener("paste", (event) => {
      this._pasteEventHandler(event as ClipboardEvent);
    });
  }

  _prePasteEventHandler() {
    // the default strategy calls preventDefault here
    // but that removes the clipboard data in Android chrome
    // so we noop instead
  }

  _postPasteEventHandler() {
    // the default strategy calls this without a timeout
    setTimeout(() => {
      this._reformatAfterPaste();
    }, 0);
  }

  _afterReformatInput(formattedState: Formatted) {
    const input = this.inputElement;

    // Some Android Chrome keyboards (notably Samsung)
    // cause the browser to not know that the value
    // of the input has changed when adding
    // permacharacters. This results in the selection
    // putting the cursor before the permacharacter,
    // instead of after.
    //
    // There is also the case of some Android Chrome
    // keyboards reporting a ranged selection on the
    // first character input. Restricted Input maintains
    // that range even though it is incorrect from the
    // keyboard.
    //
    // To resolve these issues we setTimeout and reset
    // the selection to the formatted end position.
    setTimeout(function () {
      const formattedSelection = formattedState.selection;

      setSelection(input, formattedSelection.end, formattedSelection.end);
    }, 0);
  }
}

export default AndroidChromeStrategy;
