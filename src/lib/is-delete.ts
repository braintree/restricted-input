const DELETE_REGEX = /^Del(ete)?$/;

export default function (event: KeyboardEvent) {
  return DELETE_REGEX.test(event.key) || event.keyCode === 46;
}
