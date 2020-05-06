import NoopStrategy from "../../../../src/lib/strategies/noop";
import BaseStrategy from "../../../../src/lib/strategies/base";

describe("Noop Strategy", function () {
  it("returns raw input value for getUnformattedValue", function () {
    const input = document.createElement("input");
    const strat = new NoopStrategy({
      element: input,
      pattern: "pattern",
    });

    input.value = "abc";

    expect(strat.getUnformattedValue()).toBe("abc");
  });
});
