import StrategyInterface, {
  StrategyOptions,
  OnPasteEventMethod,
} from "./strategy-interface";
import keyCannotMutateValue from "../key-cannot-mutate-value";
import { get as getSelection, set as setSelection } from "../input-selection";
import isBackspace from "../is-backspace";
import isDelete from "../is-delete";
import Formatter, { FormatMetadata } from "../formatter";

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

class BaseStrategy extends StrategyInterface {
  formatter: Formatter;
  _onPasteEvent?: OnPasteEventMethod;
  _stateToFormat?: FormatMetadata;

  constructor(options: StrategyOptions) {
    super(options);

    this.formatter = new Formatter(options.pattern);
    this._onPasteEvent = options.onPasteEvent;

    this._attachListeners();

    this._formatIfNotEmpty();
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

  _formatIfNotEmpty(): void {
    if (this.inputElement.value) {
      this._reformatInput();
    }
  }

  setPattern(pattern: string): void {
    this._unformatInput();

    this.formatter = new Formatter(pattern);

    this._formatIfNotEmpty();
  }

  _attachListeners(): void {
    this.inputElement.addEventListener("keydown", (e) => {
      const event = e as KeyboardEvent;

      if (isSimulatedEvent(event)) {
        this.isFormatted = false;
      }

      if (keyCannotMutateValue(event)) {
        return;
      }

      if (this._isDeletion(event)) {
        this._unformatInput();
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
      this._unformatInput();
    });
    this.inputElement.addEventListener("keyup", () => {
      this._reformatInput();
    });
    this.inputElement.addEventListener("input", (event) => {
      // Safari AutoFill fires CustomEvents
      // LastPass sends an `isTrusted: false` property
      // Since the input is changed all at once, set isFormatted
      // to false so that reformatting actually occurs
      if (event instanceof CustomEvent || !event.isTrusted) {
        this.isFormatted = false;
      }
      this._reformatInput();
    });
    this.inputElement.addEventListener("paste", (event) => {
      this._pasteEventHandler(event as ClipboardEvent);
    });
  }

  _isDeletion(event: KeyboardEvent): boolean {
    return isDelete(event) || isBackspace(event);
  }

  _reformatInput(): void {
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

    this._afterReformatInput(formattedState);
  }

  // If a strategy needs to impliment specific behavior
  // after reformatting has happend, the strategy just
  // overwrites this method on their own prototype
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _afterReformatInput(formattedState: FormatMetadata): void {
    // noop
  }

  _unformatInput(): void {
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

  _prePasteEventHandler(event: ClipboardEvent): void {
    // without this, the paste event is called twice
    // so if you were pasting abc it would result in
    // abcabc
    event.preventDefault();
  }

  _postPasteEventHandler(): void {
    this._reformatAfterPaste();
  }

  _pasteEventHandler(event: ClipboardEvent): void {
    let splicedEntry;
    let entryValue = "";

    this._prePasteEventHandler(event);

    this._unformatInput();

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

    if (this._onPasteEvent) {
      this._onPasteEvent({
        unformattedInputValue: splicedEntry,
      });
    }

    this.inputElement.value = splicedEntry;
    setSelection(
      this.inputElement,
      selection.start + entryValue.length,
      selection.start + entryValue.length
    );

    this._postPasteEventHandler();
  }

  _reformatAfterPaste(): void {
    const event = document.createEvent("Event");

    this._reformatInput();

    event.initEvent("input", true, true);
    this.inputElement.dispatchEvent(event);
  }

  _getStateToFormat(): FormatMetadata {
    const input = this.inputElement;
    const selection = getSelection(input);
    let stateToFormat = {
      selection: selection,
      value: input.value,
    };

    if (this._stateToFormat) {
      stateToFormat = this._stateToFormat;
      delete this._stateToFormat;
    } else if (selection.start === input.value.length && this.isFormatted) {
      stateToFormat = this.formatter.unformat(stateToFormat);
    }

    return stateToFormat;
  }
}

export default BaseStrategy;
