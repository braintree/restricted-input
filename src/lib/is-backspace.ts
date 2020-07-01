export function isBackspace(event: KeyboardEvent): boolean {
  return event.key === "Backspace" || event.keyCode === 8;
}
