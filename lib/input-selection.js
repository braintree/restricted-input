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
    // Some Android Chrome keyboards need to
    // be in a setTimeout before setting selection
    // or the selection will be off when accounting
    // for permacharacters
    setTimeout(function () {
      element.setSelectionRange(start, end);
    }, 0);
  }
}

module.exports = {
  get: get,
  set: set
};
