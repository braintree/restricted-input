export function makeInput(value = "", focused = false): HTMLInputElement {
  const input = document.createElement("input");
  input.value = value;
  document.body.appendChild(input);
  if (focused) {
    input.focus();
  }
  return input;
}

export function fireEvent(
  element: HTMLInputElement,
  type: string,
  init: Record<string, unknown> = {},
): Event {
  let event: Event;
  if (type === "keydown" || type === "keypress" || type === "keyup") {
    event = new KeyboardEvent(type, { bubbles: true, ...init });
  } else if (type === "paste") {
    event = new ClipboardEvent(type, { bubbles: true, ...init });
  } else {
    event = new Event(type, { bubbles: true, ...init });
  }
  element.dispatchEvent(event);
  return event;
}
