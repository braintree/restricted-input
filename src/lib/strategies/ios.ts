import { BaseStrategy, isSimulatedEvent } from "./base";
import { keyCannotMutateValue } from "../key-cannot-mutate-value";
import { get as getSelection, set as setSelection } from "../input-selection";

export class IosStrategy extends BaseStrategy {
  // No keydown before an input event means autofill overwrote the value,
  // not a keystroke.
  private hasKeydownEvent = false;
  private isHandlingPaste = false;

  getUnformattedValue(): string {
    return super.getUnformattedValue(true);
  }

  protected attachListeners(): void {
    this.inputElement.addEventListener("keydown", (event) => {
      const isKeyboardEvent = event instanceof KeyboardEvent;
      if (!isKeyboardEvent && this.inputElement.value.length > 0) {
        this.stateToFormat = {
          selection: { start: 0, end: 0 },
          value: this.inputElement.value,
        };
      } else if (this.stateToFormat) {
        delete this.stateToFormat;
      }

      this.keydownListener(event as KeyboardEvent);
    });
    this.inputElement.addEventListener("keyup", () => {
      this.hasKeydownEvent = false;
    });
    this.inputElement.addEventListener("input", (event) => {
      // pasteEventHandler already formatted the value and dispatches this
      // itself purely to notify other listeners; nothing left to do here.
      if (this.isHandlingPaste) {
        return;
      }

      const isCustomEvent = event instanceof CustomEvent;
      // A raw autofill write has no keydown (Chrome's is simulated and
      // filtered out by isSimulatedEvent) and no inputType, unlike a real
      // edit (cut, drop, composition, typing), which the browser already
      // applied correctly.
      const isWholesaleWrite =
        !isCustomEvent &&
        !this.hasKeydownEvent &&
        !(event as InputEvent).inputType;

      this.hasKeydownEvent = false;

      // Safari AutoFill uses CustomEvents. Either way, reformat from the
      // current value instead of diffing it.
      if (isCustomEvent) {
        this.stateToFormat = {
          selection: { start: 0, end: 0 },
          value: this.inputElement.value,
        };
      } else if (isWholesaleWrite) {
        this.stateToFormat = {
          selection: getSelection(this.inputElement),
          value: this.inputElement.value,
        };
      }

      this.formatListener();

      if (!isCustomEvent) {
        this.fixLeadingBlankSpaceOnIos();
      }
    });
    this.inputElement.addEventListener("paste", (event) => {
      this.isHandlingPaste = true;
      try {
        this.pasteEventHandler(event as ClipboardEvent);
      } finally {
        this.isHandlingPaste = false;
      }
    });
  }

  // When deleting the last character on iOS, the cursor
  // is positioned as if there is a blank space when there
  // is not, setting it to '' in a setTimeout fixes it ¯\_(ツ)_/¯
  private fixLeadingBlankSpaceOnIos(): void {
    const input = this.inputElement;

    if (input.value === "") {
      setTimeout(function () {
        input.value = "";
      }, 0);
    }
  }

  private formatListener(): void {
    if (this.isFormatted) {
      return;
    }

    const input = this.inputElement;
    const stateToFormat = this.getStateToFormat();
    const formattedState = this.formatter.format(stateToFormat);

    this.isFormatted = true;
    input.value = formattedState.value;
    setSelection(
      input,
      formattedState.selection.start,
      formattedState.selection.end,
    );
  }

  private keydownListener(event: KeyboardEvent): void {
    if (keyCannotMutateValue(event)) {
      return;
    }

    if (!isSimulatedEvent(event)) {
      this.hasKeydownEvent = true;
    }

    if (this.isDeletion(event)) {
      this.stateToFormat = this.formatter.simulateDeletion({
        event: event,
        selection: getSelection(this.inputElement),
        value: this.inputElement.value,
      });
    }

    this.unformatInput();
  }
}
