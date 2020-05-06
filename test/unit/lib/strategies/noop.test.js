const NoopStrategy = require("../../../../lib/strategies/noop");
const BaseStrategy = require("../../../../lib/strategies/base");

describe("Noop Strategy", function () {
  it("has the same public methods as Base Strategy", function () {
    const noopPublicMethods = Object.getOwnPropertyNames(
      NoopStrategy.prototype
    ).filter(function (property) {
      return (
        typeof NoopStrategy.prototype[property] === "function" &&
        property[0] !== "_"
      );
    });
    const basePublicMethods = Object.getOwnPropertyNames(
      BaseStrategy.prototype
    ).filter(function (property) {
      return (
        typeof BaseStrategy.prototype[property] === "function" &&
        property[0] !== "_"
      );
    });

    expect(noopPublicMethods.length > 0).toBe(true);
    expect(noopPublicMethods.length).toBe(basePublicMethods.length);
    basePublicMethods.forEach(function (method) {
      expect(noopPublicMethods).toEqual(expect.arrayContaining([method]));
    });
  });
});
