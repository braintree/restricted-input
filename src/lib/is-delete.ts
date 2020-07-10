const DELETE_REGEX = /^Del(ete)?$/;

export function isDelete(event: KeyboardEvent): boolean {
  return DELETE_REGEX.test(event.key) || event.keyCode === 46;
}
