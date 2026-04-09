import {
  get as getCurrentSelection,
  set as setSelection,
} from "../../../src/lib/input-selection";

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
      },
    );
  });
});

describe("setSelection", function () {
  it("calls setSelectionRange when element is the active element", function () {
    const element = document.createElement("input");
    element.value = "hello world";
    document.body.appendChild(element);
    element.focus();

    jest.spyOn(element, "setSelectionRange");
    setSelection(element, 2, 7);

    expect(element.setSelectionRange).toHaveBeenCalledWith(2, 7);
  });

  it("does not call setSelectionRange when element is not active", function () {
    const element = document.createElement("input");
    element.value = "hello world";
    document.body.appendChild(element);
    // element is NOT focused — document.activeElement will be body

    jest.spyOn(element, "setSelectionRange");
    setSelection(element, 2, 7);

    expect(element.setSelectionRange).not.toHaveBeenCalled();
  });
});
