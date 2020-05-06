const getCurrentSelection = require("../../../lib/input-selection").get;

describe("getCurrentSelection", function () {
  describe("element type", function () {
    ["input", "textarea"].forEach(function (el) {
      it("returns selection range for " + el, function () {
        const element = document.createElement(el);

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
});
