export default function (event: KeyboardEvent) {
  return event.key === "Backspace" || event.keyCode === 8;
}
