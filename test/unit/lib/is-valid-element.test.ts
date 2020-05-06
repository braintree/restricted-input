import isValidElement from "../../../src/lib/is-valid-element";

describe("isValidElement", function () {
  [
    { nodeType: "div", expectation: false },
    { nodeType: "span", expectation: false },
    { nodeType: "a", expectation: false },
    { nodeType: "p", expectation: false },
    { nodeType: "ul", expectation: false },
    { nodeType: "li", expectation: false },
    { nodeType: "header", expectation: false },
    { nodeType: "section", expectation: false },
    { nodeType: "table", expectation: false },
    { nodeType: "button", expectation: false },
    { nodeType: "foo", expectation: false },
    { nodeType: "input", expectation: true },
    { nodeType: "textarea", expectation: true },
  ].forEach(function (el) {
    it("returns " + el.expectation + " for " + el.nodeType, function () {
      expect(isValidElement(document.createElement(el.nodeType))).toBe(
        el.expectation
      );
    });
  });
});
