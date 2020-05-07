import Formatter, {
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
      [
        { input: "4", output: "4", pattern: NON_AMEX_CARD_PATTERN },
        { input: "41", output: "41", pattern: NON_AMEX_CARD_PATTERN },
        { input: "411", output: "411", pattern: NON_AMEX_CARD_PATTERN },
        { input: "4111", output: "4111 ", pattern: NON_AMEX_CARD_PATTERN },
        {
          input: "4111111111111111",
          output: "4111 1111 1111 1111",
          pattern: NON_AMEX_CARD_PATTERN,
        },
        {
          input: "94819849871",
          output: "9481 9849 871",
          pattern: NON_AMEX_CARD_PATTERN,
        },
        { input: "1", output: "1" },
        { input: "12", output: "12-" },
        { input: "123", output: "12-3" },
        { input: "9", output: "9", pattern: "{{9}}" },
        { input: "8", output: "--8x", pattern: "--{{9}}x{{a}}z" },
        { input: "8b", output: "--8xbz", pattern: "--{{9}}x{{a}}z" },
        { input: "", output: "--", pattern: "--{{9}}x{{a}}z" },
        { input: "9238923", output: "92-38" },
        { input: "11bb", output: "11 bb", pattern: "{{99}} {{aa}}" },
        { input: "aaaa", output: "", pattern: "{{99}} {{AA}}" },
        { input: "9999", output: "99 99", pattern: "{{23}} {{45}}" },
        { input: "9999", output: "", pattern: "{{BB}} {{AA}}" },
        { input: "9999", output: "", pattern: "{{B}}-{{B}}_///{{AA}}" },
        { input: "9999", output: "--", pattern: "--{{B}}-{{B}}_///{{AA}}" },
        {
          input: "CBAA",
          output: "--C-B_///AA",
          pattern: "--{{C}}-{{B}}_///{{AA}}",
        },
        {
          input: "a1b2z",
          output: "a--_1/b2z",
          pattern: "{{A}}--_{{9}}/{{A}}{{9}}{{A}}",
        },
        { input: "!#$%&--", output: "", pattern: NON_AMEX_CARD_PATTERN },
        { input: "4!#$%&--", output: "4", pattern: NON_AMEX_CARD_PATTERN },
        { input: "4!#$%5&--", output: "45", pattern: NON_AMEX_CARD_PATTERN },
        { input: "A", output: "A", pattern: "{{*}}" },
        { input: "9", output: "9", pattern: "{{*}}" },
        { input: "98", output: "9", pattern: "{{*}}" },
        { input: "!8", output: "!", pattern: "{{*}}" },
      ].forEach(function (test) {
        const pattern = test.pattern || FAKE_PATTERN;

        it(
          "injects permaChars for " + test.input + " with " + pattern,
          function () {
            const formatter = new Formatter(pattern);
            const options = {
              selection: {
                start: test.input.length,
                end: test.input.length,
              },
              value: test.input,
            };

            expect(formatter.format(options).value).toBe(test.output);
          }
        );
      });
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
