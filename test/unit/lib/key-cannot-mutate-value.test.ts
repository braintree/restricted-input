import { keyCannotMutateValue } from "../../../src/lib/key-cannot-mutate-value";

function makeEvent(
  overrides: Partial<KeyboardEvent> & { value?: string; start?: number },
): KeyboardEvent {
  const input = document.createElement("input");
  input.value = overrides.value ?? "hello";
  const start = overrides.start ?? 2;
  input.setSelectionRange(start, start);
  document.body.appendChild(input);
  input.focus();

  const event = new KeyboardEvent("keydown", {
    key: overrides.key,
    keyCode: overrides.keyCode,
    shiftKey: overrides.shiftKey ?? false,
    bubbles: true,
  });

  // currentTarget is normally set by the browser during dispatch; simulate it
  Object.defineProperty(event, "currentTarget", { value: input });
  Object.defineProperty(event, "srcElement", { value: input });

  return event;
}

describe("keyCannotMutateValue", function () {
  describe("event.key branch", function () {
    it("falls through to keyCode when key is undefined", function () {
      // undefined key, keyCode 65 ('a') → can mutate → false
      const event = makeEvent({ key: undefined, keyCode: 65 });
      expect(keyCannotMutateValue(event)).toBe(false);
    });

    it("falls through to keyCode when key is 'Unidentified'", function () {
      const event = makeEvent({ key: "Unidentified", keyCode: 9 });
      expect(keyCannotMutateValue(event)).toBe(true); // tab
    });

    it("falls through to keyCode when key is empty string", function () {
      const event = makeEvent({ key: "", keyCode: 27 });
      expect(keyCannotMutateValue(event)).toBe(true); // escape
    });

    it("returns false for Backspace when not at beginning", function () {
      const event = makeEvent({ key: "Backspace", value: "hello", start: 2 });
      expect(keyCannotMutateValue(event)).toBe(false);
    });

    it("returns true for Backspace when at beginning", function () {
      const event = makeEvent({ key: "Backspace", value: "hello", start: 0 });
      expect(keyCannotMutateValue(event)).toBe(true);
    });

    it("returns false for Delete when not at end", function () {
      const event = makeEvent({ key: "Delete", value: "hello", start: 2 });
      expect(keyCannotMutateValue(event)).toBe(false);
    });

    it("returns true for Delete when at end", function () {
      const event = makeEvent({ key: "Delete", value: "hello", start: 5 });
      expect(keyCannotMutateValue(event)).toBe(true);
    });

    it("returns false for Del when not at end", function () {
      const event = makeEvent({ key: "Del", value: "hello", start: 2 });
      expect(keyCannotMutateValue(event)).toBe(false);
    });

    it("returns true for Del when at end", function () {
      const event = makeEvent({ key: "Del", value: "hello", start: 5 });
      expect(keyCannotMutateValue(event)).toBe(true);
    });

    it("returns true for multi-char key (e.g. ArrowLeft)", function () {
      const event = makeEvent({ key: "ArrowLeft" });
      expect(keyCannotMutateValue(event)).toBe(true);
    });

    it("returns true for multi-char key (e.g. Enter)", function () {
      const event = makeEvent({ key: "Enter" });
      expect(keyCannotMutateValue(event)).toBe(true);
    });

    it("returns false for single printable char", function () {
      const event = makeEvent({ key: "a" });
      expect(keyCannotMutateValue(event)).toBe(false);
    });

    it("returns false for single digit char", function () {
      const event = makeEvent({ key: "5" });
      expect(keyCannotMutateValue(event)).toBe(false);
    });
  });

  describe("event.keyCode branch (key is undefined/unidentified/empty)", function () {
    function makeKeyCodeEvent(
      keyCode: number,
      opts: { shiftKey?: boolean; value?: string; start?: number } = {},
    ): KeyboardEvent {
      return makeEvent({
        key: undefined,
        keyCode,
        shiftKey: opts.shiftKey ?? false,
        value: opts.value,
        start: opts.start,
      });
    }

    it("returns true for Tab (9)", function () {
      expect(keyCannotMutateValue(makeKeyCodeEvent(9))).toBe(true);
    });

    it("returns true for Pause/Break (19)", function () {
      expect(keyCannotMutateValue(makeKeyCodeEvent(19))).toBe(true);
    });

    it("returns true for Caps Lock (20)", function () {
      expect(keyCannotMutateValue(makeKeyCodeEvent(20))).toBe(true);
    });

    it("returns true for Escape (27)", function () {
      expect(keyCannotMutateValue(makeKeyCodeEvent(27))).toBe(true);
    });

    it("returns true for right arrow (39)", function () {
      expect(keyCannotMutateValue(makeKeyCodeEvent(39))).toBe(true);
    });

    it("returns true for Insert (45)", function () {
      expect(keyCannotMutateValue(makeKeyCodeEvent(45))).toBe(true);
    });

    describe("shift-sensitive keys (33-38, 40)", function () {
      [33, 34, 35, 36, 37, 38, 40].forEach((code) => {
        it(`returns true for keyCode ${code} without shift`, function () {
          expect(keyCannotMutateValue(makeKeyCodeEvent(code))).toBe(true);
        });

        it(`returns false for keyCode ${code} with shift`, function () {
          expect(
            keyCannotMutateValue(makeKeyCodeEvent(code, { shiftKey: true })),
          ).toBe(false);
        });
      });
    });

    it("returns true for Backspace (8) at beginning", function () {
      expect(
        keyCannotMutateValue(makeKeyCodeEvent(8, { value: "hello", start: 0 })),
      ).toBe(true);
    });

    it("returns false for Backspace (8) not at beginning", function () {
      expect(
        keyCannotMutateValue(makeKeyCodeEvent(8, { value: "hello", start: 2 })),
      ).toBe(false);
    });

    it("returns true for Delete (46) at end", function () {
      expect(
        keyCannotMutateValue(
          makeKeyCodeEvent(46, { value: "hello", start: 5 }),
        ),
      ).toBe(true);
    });

    it("returns false for Delete (46) not at end", function () {
      expect(
        keyCannotMutateValue(
          makeKeyCodeEvent(46, { value: "hello", start: 2 }),
        ),
      ).toBe(false);
    });

    it("returns false for unknown keyCode (default)", function () {
      expect(keyCannotMutateValue(makeKeyCodeEvent(65))).toBe(false);
    });

    it("returns false for keyCode 0 (default)", function () {
      expect(keyCannotMutateValue(makeKeyCodeEvent(0))).toBe(false);
    });
  });
});
