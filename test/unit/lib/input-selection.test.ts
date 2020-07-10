import { get as getCurrentSelection } from "../../../src/lib/input-selection";

describe("getCurrentSelection", function () {
  describe("element type", function () {
    it.each(["input", "textarea"])(
      "returns selection range for %s",
      (elementType) => {
        const element = document.createElement(elementType) as HTMLInputElement;

        // set a value so the element has text to select
        element.value = "asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasd";
        element.setSelectionRange(10, 23);

        const result = getCurrentSelection(element);

        expect(result).toEqual({
          start: 10,
          end: 23,
          delta: 13,
        });
      }
    );
  });
});
