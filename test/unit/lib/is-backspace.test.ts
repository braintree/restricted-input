import { isBackspace } from "../../../src/lib/is-backspace";

describe("isBackspace()", function () {
  it('returns true if key is "Backspace"', function () {
    expect(isBackspace(new KeyboardEvent("keyup", { key: "Backspace" }))).toBe(
      true
    );
  });

  it("returns true if keyCode is 8", function () {
    expect(
      isBackspace(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new KeyboardEvent("keyup", { key: "Not Backspace", keyCode: 8 } as any)
      )
    ).toBe(true);
  });

  it('returns false if key is not "Backspace" and keyCode is not 8', function () {
    expect(
      isBackspace(new KeyboardEvent("keyup", { key: "Not Backspace" }))
    ).toBe(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(isBackspace(new KeyboardEvent("keyup", { keyCode: 0 } as any))).toBe(
      false
    );
  });
});
