'use strict';

function get(element) {
  var start, end;

  start = element.selectionStart;
  end = element.selectionEnd;

  return {
    start: start,
    end: end,
    delta: Math.abs(end - start)
  };
}

function set(element, start, end) {
  // Some browsers explode if you use setSelectionRange
  // on a non-focused element
  if (document.activeElement === element && element.setSelectionRange) {
    element.setSelectionRange(start, end);
  }
}

module.exports = {
  get: get,
  set: set
};
