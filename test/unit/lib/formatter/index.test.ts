import {
  PatternFormatter as Formatter,
  SimulateDeleteOptions,
} from "../../../../src/lib/formatter";

const NON_AMEX_CARD_PATTERN = "{{9999}} {{9999}} {{9999}} {{9999}}";
const FAKE_PATTERN = "{{99}}-{{99}}";

describe("Formatter", function () {
  describe("constructor()", function () {
    it("sets a pattern", function () {
      expect(new Formatter("{{9}}").pattern).toEqual([
        {
          value: /\d/,
          isPermaChar: false,
          index: 0,
        },
      ]);
    });
  });

  describe("format()", function () {
    it("moves selection to the correct position when modifying input", function () {
      const formatter = new Formatter("--{{9}}x{{a}}z");
      const options = {
        selection: { start: 2, end: 2 },
        value: "8b",
      };
      const result = formatter.format(options);

      expect(result.value).toBe("--8xbz");
      expect(result.selection.start).toBe(6);
      expect(result.selection.end).toBe(6);
    });

    it("can move selection across permaChars", function () {
      const formatter = new Formatter("{{99}} / {{99}}");
      const options = {
        selection: { start: 3, end: 3 },
        value: "102",
      };

      expect(formatter.format(options).value).toBe("10 / 2");
      expect(formatter.format(options).selection).toEqual({
        start: 6,
        end: 6,
      });
    });

    it("can keep selection in place if before a permaChar", function () {
      const formatter = new Formatter("{{99}} / {{99}}");
      const options = {
        selection: { start: 1, end: 1 },
        value: "102",
      };

      expect(formatter.format(options).value).toBe("10 / 2");
      expect(formatter.format(options).selection).toEqual({
        start: 1,
        end: 1,
      });
    });

    it("can format and re-unformat to get the same result", function () {
      const formatter = new Formatter("{{9999}} {{9999}}");
      const options = {
        selection: { start: 5, end: 5 },
        value: "123456",
      };

      const formatted = formatter.format(options);
      const reunformatted = formatter.unformat(formatted);

      expect(reunformatted).toEqual(options);
    });

    describe("formatting", function () {
      // each cases array is in the form input, pattern, expected result
      const cases = [
        ["4", NON_AMEX_CARD_PATTERN, "4"],
        ["41", NON_AMEX_CARD_PATTERN, "41"],
        ["411", NON_AMEX_CARD_PATTERN, "411"],
        ["4111", NON_AMEX_CARD_PATTERN, "4111 "],
        ["4111111111111111", NON_AMEX_CARD_PATTERN, "4111 1111 1111 1111"],
        ["94819849871", NON_AMEX_CARD_PATTERN, "9481 9849 871"],
        ["1", FAKE_PATTERN, "1"],
        ["12", FAKE_PATTERN, "12-"],
        ["123", FAKE_PATTERN, "12-3"],
        ["9", "{{9}}", "9"],
        ["8", "--{{9}}x{{a}}z", "--8x"],
        ["8b", "--{{9}}x{{a}}z", "--8xbz"],
        ["", "--{{9}}x{{a}}z", "--"],
        ["9238923", FAKE_PATTERN, "92-38"],
        ["11bb", "{{99}} {{aa}}", "11 bb"],
        ["aaaa", "{{99}} {{AA}}", ""],
        ["9999", "{{23}} {{45}}", "99 99"],
        ["9999", "{{BB}} {{AA}}", ""],
        ["9999", "{{B}}-{{B}}_///{{AA}}", ""],
        ["9999", "--{{B}}-{{B}}_///{{AA}}", "--"],
        ["CBAA", "--{{C}}-{{B}}_///{{AA}}", "--C-B_///AA"],
        ["a1b2z", "{{A}}--_{{9}}/{{A}}{{9}}{{A}}", "a--_1/b2z"],
        ["!#$%&--", NON_AMEX_CARD_PATTERN, ""],
        ["4!#$%&--", NON_AMEX_CARD_PATTERN, "4"],
        ["4!#$%5&--", NON_AMEX_CARD_PATTERN, "45"],
        ["A", "{{*}}", "A"],
        ["9", "{{*}}", "9"],
        ["98", "{{*}}", "9"],
        ["!8", "{{*}}", "!"],
      ];
      it.each(cases)(
        "injects permaChars for %s with %s",
        function (input, pattern, expectedResult) {
          const formatter = new Formatter(pattern);
          const options = {
            selection: {
              start: input.length,
              end: input.length,
            },
            value: input,
          };

          expect(formatter.format(options).value).toBe(expectedResult);
        }
      );
    });

    describe("selection", function () {
      it("updates selection position", function () {
        const formatter = new Formatter(NON_AMEX_CARD_PATTERN);
        const input = "4111";
        const inputSelection = {
          start: 3,
          end: 4,
        };
        const outputSelection = {
          start: 3,
          end: 5,
        };
        const options = {
          selection: inputSelection,
          value: input,
        };

        expect(formatter.format(options).selection).toEqual(outputSelection);
      });

      it("updates selection with multiple permaChars", function () {
        const formatter = new Formatter(NON_AMEX_CARD_PATTERN);
        const input = "41111111111";
        const inputSelection = {
          start: 5,
          end: 11,
        };
        const outputSelection = {
          start: 6,
          end: 13,
        };
        const options = {
          selection: inputSelection,
          value: input,
        };

        expect(formatter.format(options).selection).toEqual(outputSelection);
      });
    });
  });

  describe("unformat()", function () {
    it("returns an unformatted string", function () {
      const formatter = new Formatter("--{{9}}x{{9}}z");
      const options = {
        selection: { start: 3, end: 3 },
        value: "--8x9z",
      };

      expect(formatter.unformat(options).value).toBe("89");
      expect(formatter.unformat(options).selection).toEqual({
        start: 1,
        end: 1,
      });
    });

    it("disambiguates between a permachar and a non-permachar", function () {
      const formatter = new Formatter("--{{9}}x{{a}}z");
      const options = {
        selection: { start: 1, end: 1 },
        value: "--8xbz",
      };

      expect(formatter.unformat(options).value).toBe("8b");
      expect(formatter.unformat(options).selection).toEqual({
        start: 0,
        end: 0,
      });
    });

    it("can unformat and re-format to get the same result", function () {
      const formatter = new Formatter("{{9999}} {{9999}}");
      const options = {
        selection: { start: 6, end: 6 },
        value: "1234 56",
      };

      const unformatted = formatter.unformat(options);
      const reformatted = formatter.format(unformatted);

      expect(reformatted).toEqual(options);
    });
  });

  describe("simulateDeletion()", function () {
    let formatter: Formatter, options: SimulateDeleteOptions;
    let unformatSpy: jest.SpyInstance;

    beforeEach(function () {
      formatter = new Formatter("{{a}}");
      options = {
        event: new KeyboardEvent("keyup"),
        selection: { start: 0, end: 0 },
        value: "",
      };

      unformatSpy = jest.spyOn(formatter, "unformat");
    });

    it("deletes all characters in selection if there is a delta in the selection start and end", function () {
      unformatSpy.mockReturnValue({
        selection: {
          start: 1,
          end: 6,
        },
        value: "abcdefghijk",
      });

      const result = formatter.simulateDeletion(options);

      expect(result).toEqual({
        selection: {
          start: 1,
          end: 1,
        },
        value: "aghijk",
      });
    });

    it("deletes one character back from the cursor start if no selection and key was backspace", function () {
      options.event = new KeyboardEvent("keyup", {
        key: "Backspace",
      });

      unformatSpy.mockReturnValue({
        selection: {
          start: 3,
          end: 3,
        },
        value: "abcdefghijk",
      });

      const result = formatter.simulateDeletion(options);

      expect(result).toEqual({
        selection: {
          start: 2,
          end: 2,
        },
        value: "abdefghijk",
      });
    });

    it("deletes one character forward from the cursor start if no selection and key was not backspace", function () {
      options.event = new KeyboardEvent("keyup", {
        key: "Delete",
      });

      unformatSpy.mockReturnValue({
        selection: {
          start: 3,
          end: 3,
        },
        value: "abcdefghijk",
      });

      const result = formatter.simulateDeletion(options);

      expect(result).toEqual({
        selection: {
          start: 3,
          end: 3,
        },
        value: "abcefghijk",
      });
    });
  });
});
