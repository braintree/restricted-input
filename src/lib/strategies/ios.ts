import BaseStrategy from "./base";
import keyCannotMutateValue from "../key-cannot-mutate-value";
import { get as getSelection, set as setSelection } from "../input-selection";

class IosStrategy extends BaseStrategy {
  getUnformattedValue(): string {
    return BaseStrategy.prototype.getUnformattedValue.call(this, true);
  }

  _attachListeners(): void {
    this.inputElement.addEventListener("keydown", (event) => {
      this._keydownListener(event as KeyboardEvent);
    });
    this.inputElement.addEventListener("input", (event) => {
      const isCustomEvent = event instanceof CustomEvent;

      // Safari AutoFill fires CustomEvents
      // Set state to format before calling format listener
      if (isCustomEvent) {
        this._stateToFormat = {
          selection: { start: 0, end: 0 },
          value: this.inputElement.value,
        };
      }

      this._formatListener();

      if (!isCustomEvent) {
        this._fixLeadingBlankSpaceOnIos();
      }
    });
    this.inputElement.addEventListener("focus", () => {
      this._formatListener();
    });
    this.inputElement.addEventListener("paste", (event) => {
      this._pasteEventHandler(event as ClipboardEvent);
    });
  }

  // When deleting the last character on iOS, the cursor
  // is positioned as if there is a blank space when there
  // is not, setting it to '' in a setTimeout fixes it ¯\_(ツ)_/¯
  _fixLeadingBlankSpaceOnIos(): void {
    const input = this.inputElement;

    if (input.value === "") {
      setTimeout(function () {
        input.value = "";
      }, 0);
    }
  }

  _formatListener(): void {
    const input = this.inputElement;
    const stateToFormat = this._getStateToFormat();
    const formattedState = this.formatter.format(stateToFormat);

    input.value = formattedState.value;
    setSelection(
      input,
      formattedState.selection.start,
      formattedState.selection.end
    );
  }

  _keydownListener(event: KeyboardEvent): void {
    if (keyCannotMutateValue(event)) {
      return;
    }
    if (this._isDeletion(event)) {
      this._stateToFormat = this.formatter.simulateDeletion({
        event: event,
        selection: getSelection(this.inputElement),
        value: this.inputElement.value,
      });
    }
  }
}

export default IosStrategy;
