'use strict';

var DELETE_REGEX = /^Del(ete)?$/;

module.exports = function (event) {
  return DELETE_REGEX.test(event.key) || event.keyCode === 46;
};
