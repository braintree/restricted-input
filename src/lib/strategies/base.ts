import {
  StrategyInterface,
  StrategyOptions,
  OnPasteEventMethod,
} from "./strategy-interface";
import { keyCannotMutateValue } from "../key-cannot-mutate-value";
import { get as getSelection, set as setSelection } from "../input-selection";
import { isBackspace } from "../is-backspace";
import { isDelete } from "../is-delete";
import { PatternFormatter as Formatter, FormatMetadata } from "../formatter";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare global {
  interface Window {
    clipboardData: {
      getData: (text: string) => string;
    };
  }
}

function isSimulatedEvent(event: KeyboardEvent): boolean {
  // 1Password sets input.value then fires keyboard events. Dependent on browser
  // here might be falsy values (key = '', keyCode = 0) or these keys might be omitted
  // Chrome autofill inserts keys all at once and fires a single event without key info
  return !event.key && !event.keyCode;
}

export class BaseStrategy extends StrategyInterface {
  formatter: Formatter;
  private onPasteEvent?: OnPasteEventMethod;
  protected stateToFormat?: FormatMetadata;

  constructor(options: StrategyOptions) {
    super(options);

    this.formatter = new Formatter(options.pattern);
    this.onPasteEvent = options.onPasteEvent;

    this.attachListeners();

    this.formatIfNotEmpty();
  }

  getUnformattedValue(forceUnformat?: boolean): string {
    let value = this.inputElement.value;

    if (forceUnformat || this.isFormatted) {
      value = this.formatter.unformat({
        value: this.inputElement.value,
        selection: { start: 0, end: 0 },
      }).value;
    }

    return value;
  }

  private formatIfNotEmpty(): void {
    if (this.inputElement.value) {
      this.reformatInput();
    }
  }

  setPattern(pattern: string): void {
    this.unformatInput();

    this.formatter = new Formatter(pattern);

    this.formatIfNotEmpty();
  }

  protected attachListeners(): void {
    this.inputElement.addEventListener("keydown", (e) => {
      const event = e as KeyboardEvent;

      if (isSimulatedEvent(event)) {
        this.isFormatted = false;
      }

      if (keyCannotMutateValue(event)) {
        return;
      }

      if (this.isDeletion(event)) {
        this.unformatInput();
      }
    });
    this.inputElement.addEventListener("keypress", (e) => {
      const event = e as KeyboardEvent;

      if (isSimulatedEvent(event)) {
        this.isFormatted = false;
      }

      if (keyCannotMutateValue(event)) {
        return;
      }
      this.unformatInput();
    });
    this.inputElement.addEventListener("keyup", () => {
      this.reformatInput();
    });
    this.inputElement.addEventListener("input", (event) => {
      // Safari AutoFill fires CustomEvents
      // LastPass sends an `isTrusted: false` property
      // Since the input is changed all at once, set isFormatted
      // to false so that reformatting actually occurs
      if (event instanceof CustomEvent || !event.isTrusted) {
        this.isFormatted = false;
      }
      this.reformatInput();
    });
    this.inputElement.addEventListener("paste", (event) => {
      this.pasteEventHandler(event as ClipboardEvent);
    });
  }

  protected isDeletion(event: KeyboardEvent): boolean {
    return isDelete(event) || isBackspace(event);
  }

  protected reformatInput(): void {
    if (this.isFormatted) {
      return;
    }

    this.isFormatted = true;
    const input = this.inputElement;
    const formattedState = this.formatter.format({
      selection: getSelection(input),
      value: input.value,
    });

    input.value = formattedState.value;
    setSelection(
      input,
      formattedState.selection.start,
      formattedState.selection.end
    );

    this.afterReformatInput(formattedState);
  }

  // If a strategy needs to impliment specific behavior
  // after reformatting has happend, the strategy just
  // overwrites this method on their own prototype
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected afterReformatInput(formattedState: FormatMetadata): void {
    // noop
  }

  protected unformatInput(): void {
    if (!this.isFormatted) {
      return;
    }

    this.isFormatted = false;
    const input = this.inputElement;
    const selection = getSelection(input);

    const unformattedState = this.formatter.unformat({
      selection: selection,
      value: input.value,
    });

    input.value = unformattedState.value;
    setSelection(
      input,
      unformattedState.selection.start,
      unformattedState.selection.end
    );
  }

  protected prePasteEventHandler(event: ClipboardEvent): void {
    // without this, the paste event is called twice
    // so if you were pasting abc it would result in
    // abcabc
    event.preventDefault();
  }

  protected postPasteEventHandler(): void {
    this.reformatAfterPaste();
  }

  protected pasteEventHandler(event: ClipboardEvent): void {
    let splicedEntry;
    let entryValue = "";

    this.prePasteEventHandler(event);

    this.unformatInput();

    if (event.clipboardData) {
      entryValue = event.clipboardData.getData("Text");
    } else if (window.clipboardData) {
      entryValue = window.clipboardData.getData("Text");
    }

    const selection = getSelection(this.inputElement);
    splicedEntry = this.inputElement.value.split("");

    splicedEntry.splice(
      selection.start,
      selection.end - selection.start,
      entryValue
    );
    splicedEntry = splicedEntry.join("");

    if (this.onPasteEvent) {
      this.onPasteEvent({
        unformattedInputValue: splicedEntry,
      });
    }

    this.inputElement.value = splicedEntry;
    setSelection(
      this.inputElement,
      selection.start + entryValue.length,
      selection.start + entryValue.length
    );

    this.postPasteEventHandler();
  }

  protected reformatAfterPaste(): void {
    const event = document.createEvent("Event");

    this.reformatInput();

    event.initEvent("input", true, true);
    this.inputElement.dispatchEvent(event);
  }

  protected getStateToFormat(): FormatMetadata {
    const input = this.inputElement;
    const selection = getSelection(input);
    let stateToFormat = {
      selection: selection,
      value: input.value,
    };

    if (this.stateToFormat) {
      stateToFormat = this.stateToFormat;
      delete this.stateToFormat;
    } else if (selection.start === input.value.length && this.isFormatted) {
      stateToFormat = this.formatter.unformat(stateToFormat);
    }

    return stateToFormat;
  }
}
