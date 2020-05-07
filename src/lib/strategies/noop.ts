import StrategyInterface from "./strategy-interface";

class NoopKeyboardStrategy extends StrategyInterface {
  getUnformattedValue(): string {
    return this.inputElement.value;
  }

  setPattern(): void {
    // noop
  }
}

export default NoopKeyboardStrategy;
