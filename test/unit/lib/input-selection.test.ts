import { get as getCurrentSelection } from "../../../src/lib/input-selection";

describe("getCurrentSelection", function () {
  describe("element type", function () {
    it("returns selection range for input", function () {
      const element = document.createElement("input");

      // set a value so the element has text to select
      element.value = "asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasd";
      element.setSelectionRange(10, 23);

      const result = getCurrentSelection(element);

      expect(result).toEqual({
        start: 10,
        end: 23,
        delta: 13,
      });
    });

    it("returns selection range for textarea", function () {
      const element = document.createElement("textarea");

      // set a value so the element has text to select
      element.value = "asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasd";
      element.setSelectionRange(10, 23);

      const result = getCurrentSelection(element);

      expect(result).toEqual({
        start: 10,
        end: 23,
        delta: 13,
      });
    });
  });
});
