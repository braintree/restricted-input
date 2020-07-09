import { BaseStrategy } from "./base";
import { keyCannotMutateValue } from "../key-cannot-mutate-value";
import {
  get as getSelection,
  set as setSelection,
  Selection,
} from "../input-selection";

function padSelection(selection: Selection, pad: number): Selection {
  return {
    start: selection.start + pad,
    end: selection.end + pad,
  };
}

export class IE9Strategy extends BaseStrategy {
  getUnformattedValue(): string {
    return BaseStrategy.prototype.getUnformattedValue.call(this, true);
  }

  protected attachListeners(): void {
    this.inputElement.addEventListener("keydown", (event) => {
      this.keydownListener(event as KeyboardEvent);
    });
    this.inputElement.addEventListener("focus", () => {
      this.format();
    });
    this.inputElement.addEventListener("paste", (event) => {
      this.pasteEventHandler(event as ClipboardEvent);
    });
  }

  private format(): void {
    const input = this.inputElement;
    const stateToFormat = this.getStateToFormat();
    const formattedState = this.formatter.format(stateToFormat);

    input.value = formattedState.value;
    setSelection(
      input,
      formattedState.selection.start,
      formattedState.selection.end
    );
  }

  private keydownListener(event: KeyboardEvent): void {
    if (keyCannotMutateValue(event)) {
      return;
    }

    event.preventDefault();

    if (this.isDeletion(event)) {
      this.stateToFormat = this.formatter.simulateDeletion({
        event: event,
        selection: getSelection(this.inputElement),
        value: this.inputElement.value,
      });
    } else {
      // IE9 does not update the input's value attribute
      // during key events, only after they complete.
      // We must retrieve the key from event.key and
      // add it to the input's value before formatting.
      const oldValue = this.inputElement.value;
      let selection = getSelection(this.inputElement);
      const newValue =
        oldValue.slice(0, selection.start) +
        event.key +
        oldValue.slice(selection.start);
      selection = padSelection(selection, 1);

      this.stateToFormat = {
        selection: selection,
        value: newValue,
      };
      if (selection.start === newValue.length) {
        this.stateToFormat = this.formatter.unformat(this.stateToFormat);
      }
    }

    this.format();
  }

  protected reformatAfterPaste(): void {
    const input = this.inputElement;
    let selection = getSelection(this.inputElement);
    const value = this.formatter.format({
      selection: selection,
      value: input.value,
    }).value;

    selection = padSelection(selection, 1);
    input.value = value;
    // IE9 sets the selection to the end of the input
    // manually setting it in a setTimeout puts it
    // in the correct position after pasting
    setTimeout(function () {
      setSelection(input, selection.start, selection.end);
    }, 0);
  }
}
