import { StrategyInterface } from "./strategy-interface";

export class NoopKeyboardStrategy extends StrategyInterface {
  getUnformattedValue(): string {
    return this.inputElement.value;
  }

  setPattern(): void {
    // noop
  }
}
