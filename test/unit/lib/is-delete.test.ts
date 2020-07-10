import { isDelete } from "../../../src/lib/is-delete";

describe("isDelete()", function () {
  it('returns true if key is "Delete"', function () {
    expect(isDelete(new KeyboardEvent("keyup", { key: "Delete" }))).toBe(true);
  });

  it('returns true if key is "Del"', function () {
    expect(isDelete(new KeyboardEvent("keyup", { key: "Del" }))).toBe(true);
  });

  it("returns true if keyCode is 46", function () {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(isDelete(new KeyboardEvent("keyup", { keyCode: 46 } as any))).toBe(
      true
    );
  });

  it('returns false if key is not "Del" or "Delete" and keyCode is not 46', function () {
    expect(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      isDelete(new KeyboardEvent("keyup", { key: "Not Delete" } as any))
    ).toBe(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(isDelete(new KeyboardEvent("keyup", { keyCode: 2 } as any))).toBe(
      false
    );
  });
});
