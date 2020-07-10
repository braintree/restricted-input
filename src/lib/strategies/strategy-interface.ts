export type Input = HTMLInputElement | HTMLTextAreaElement;
export type OnPasteEventMethod = (options: {
  unformattedInputValue: string;
}) => void;
export type StrategyOptions = {
  element: Input;
  pattern: string;
  onPasteEvent?: OnPasteEventMethod;
};

export abstract class StrategyInterface {
  inputElement: Input;
  isFormatted: boolean;

  constructor(options: StrategyOptions) {
    this.inputElement = options.element;
    this.isFormatted = false;
  }

  abstract getUnformattedValue(): string;
  abstract setPattern(pattern: string): void;
}
