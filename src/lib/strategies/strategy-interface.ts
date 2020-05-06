export type Input = HTMLInputElement | HTMLTextAreaElement;
export type StrategyOptions = {
  element: Input;
  pattern: string;
  onPasteEvent?: Function; // TODO configure shape of function
};

export default abstract class StrategyInterface {
  inputElement: Input;
  isFormatted: boolean;

  constructor(options: StrategyOptions) {
    this.inputElement = options.element;
    this.isFormatted = false;
  }

  abstract getUnformattedValue(): string;
  abstract setPattern(pattern: string): void;
}
