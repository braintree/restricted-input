'use strict';

var RestrictedInput = require('../../lib/restricted-input');

global.defaultPattern = '{{9999}} {{9999}} {{9999}} {{9999}}';

global.getInputNode = function () {
  return document.createElement('input');
};

global.getCleanInstance = function (optionsArg) {
  var options = optionsArg || {};

  return new RestrictedInput(Object.assign({}, {
    element: global.getInputNode(),
    pattern: global.defaultPattern
  }, options));
};

beforeEach(function () {
  document.body.innerHTML = '';
});

afterEach(function () {
  jest.restoreAllMocks();
});
