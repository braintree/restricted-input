import { keyCannotMutateValue } from "../key-cannot-mutate-value";
import { BaseStrategy } from "./base";
import { FormatMetadata } from "../formatter";
import { set as setSelection } from "../input-selection";

export class AndroidChromeStrategy extends BaseStrategy {
  protected attachListeners(): void {
    this.inputElement.addEventListener("keydown", (event) => {
      if (keyCannotMutateValue(event as KeyboardEvent)) {
        return;
      }
      this.unformatInput();
    });

    // 'keypress' is not fired with some Android keyboards (see #23)
    this.inputElement.addEventListener("keypress", (event) => {
      if (keyCannotMutateValue(event as KeyboardEvent)) {
        return;
      }
      this.unformatInput();
    });

    this.inputElement.addEventListener("keyup", () => {
      this.reformatInput();
    });

    this.inputElement.addEventListener("input", () => {
      this.reformatInput();
    });

    this.inputElement.addEventListener("paste", (event) => {
      event.preventDefault();
      this.pasteEventHandler(event as ClipboardEvent);
    });
  }

  protected prePasteEventHandler(): void {
    // the default strategy calls preventDefault here
    // but that removes the clipboard data in Android chrome
    // so we noop instead
  }

  protected postPasteEventHandler(): void {
    // the default strategy calls this without a timeout
    setTimeout(() => {
      this.reformatAfterPaste();
    }, 0);
  }

  protected afterReformatInput(formattedState: FormatMetadata): void {
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
