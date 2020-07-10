import { parsePattern } from "../../../../src/lib/formatter/parse-pattern";

describe("parsePattern", function () {
  it("returns a collection of objects", function () {
    const parsed = parsePattern("{{9999}} {{9999}}");

    expect(parsed).toHaveLength(9);
    expect(parsed[0]).toEqual({
      value: /\d/,
      isPermaChar: false,
      index: 0,
    });
    expect(parsed[4]).toEqual({
      value: " ",
      isPermaChar: true,
      index: 4,
    });
  });

  describe("wildcard pattern", function () {
    it("takes a wildcard pattern", function () {
      expect(parsePattern("{{*}}")[0].value).toEqual(/./);
    });
  });

  describe("digit patterns", function () {
    it.each("0123456789".split(""))(
      "creates a regex for digits with %s",
      (digit) => {
        expect(parsePattern("{{" + digit + "}}")[0].value).toEqual(/\d/);
      }
    );
  });

  describe("non-digit patterns", function () {
    it.each("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""))(
      "creates a regex for non-digits with %s",
      (character) => {
        expect(parsePattern("{{" + character + "}}")[0].value).toEqual(
          /[A-Za-z]/
        );
      }
    );
  });

  describe("invalid patterns", function () {
    it.each([
      "{{-}}",
      "{{_}}",
      "{{!}}",
      "{{@}}",
      "{{#}}",
      "{{$}}",
      "{{%}}",
      "{{^}}",
      "{{&}}",
      "{{(}}",
      "{{)}}",
      "{{+}}",
      "{{?}}",
      "{{>}}",
      "{{<}}",
      "{{,}}",
      "{{.}}",
      "{{'}}",
      '{{"}}',
      "{{\\}}",
      "{{/}}",
      "{{A--}}",
      "{{9999}} {{99-9}}",
    ])("throws for %s", function (pattern) {
      expect(function () {
        parsePattern(pattern);
      }).toThrowError(
        "Only alphanumeric or wildcard pattern matchers are allowed"
      );
    });
  });
});
