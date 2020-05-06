const isBackspace = require("../../../lib/is-backspace");

describe("isBackspace()", function () {
  it('returns true if key is "Backspace"', function () {
    expect(isBackspace({ key: "Backspace", keyCode: 0 })).toBe(true);
  });

  it("returns true if keyCode is 8", function () {
    expect(isBackspace({ key: "Not Backspace", keyCode: 8 })).toBe(true);
  });

  it('returns false if key is not "Backspace" and keyCode is not 8', function () {
    expect(isBackspace({ key: "Not Backspace", keyCode: 0 })).toBe(false);
  });
});
