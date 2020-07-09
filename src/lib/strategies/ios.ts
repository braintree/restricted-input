import { BaseStrategy } from "./base";
import { keyCannotMutateValue } from "../key-cannot-mutate-value";
import { get as getSelection, set as setSelection } from "../input-selection";

export class IosStrategy extends BaseStrategy {
  getUnformattedValue(): string {
    return super.getUnformattedValue(true);
  }

  protected attachListeners(): void {
    this.inputElement.addEventListener("keydown", (event) => {
      this.keydownListener(event as KeyboardEvent);
    });
    this.inputElement.addEventListener("input", (event) => {
      const isCustomEvent = event instanceof CustomEvent;

      // Safari AutoFill fires CustomEvents
      // Set state to format before calling format listener
      if (isCustomEvent) {
        this.stateToFormat = {
          selection: { start: 0, end: 0 },
          value: this.inputElement.value,
        };
      }

      this.formatListener();

      if (!isCustomEvent) {
        this.fixLeadingBlankSpaceOnIos();
      }
    });
    this.inputElement.addEventListener("focus", () => {
      this.formatListener();
    });
    this.inputElement.addEventListener("paste", (event) => {
      this.pasteEventHandler(event as ClipboardEvent);
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
    if (this.isDeletion(event)) {
      this.stateToFormat = this.formatter.simulateDeletion({
        event: event,
        selection: getSelection(this.inputElement),
        value: this.inputElement.value,
      });
    }
  }
}
