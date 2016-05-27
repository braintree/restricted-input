'use strict';

module.exports = function (element) {
  return Boolean(element) && (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement);
};
