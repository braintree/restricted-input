'use strict';

var RestrictedInput = require('../../lib/restricted-input');
var assign = require('lodash.assign');

global.defaultPattern = '{{9999}} {{9999}} {{9999}} {{9999}}';

global.getInputNode = function () {
  return document.createElement('input');
};

global.getCleanInstance = function (optionsArg) {
  var options = optionsArg || {};

  return new RestrictedInput(assign({}, {
    element: global.getInputNode(),
    pattern: global.defaultPattern
  }, options));
};

before(function () {
  global.sandbox = sinon.createSandbox();
  document.body.innerHTML = '';
});

after(function () {
  global.sandbox.restore();
});
