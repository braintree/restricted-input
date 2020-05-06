import StrategyInterface from "./strategy-interface";

class NoopKeyboardStrategy extends StrategyInterface {
  getUnformattedValue() {
    return this.inputElement.value;
  }

  setPattern() {
    // noop
  }
}

export default NoopKeyboardStrategy;
