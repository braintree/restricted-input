'use strict';

var RestrictedInput = require('../../../lib/restricted-input');

describe('RestrictedInput', function () {
  beforeEach(function () {
    global.defaultState = {value: '', caretIndex: 0};
  });

  afterEach(function () {
    global.inputNode = null;
  });

  describe('constructor()', function () {
    it('throws an error if an input or textarea is not provided', function () {
      function fn() {
        return new RestrictedInput({
          element: document.createElement('div'),
          pattern: /^/g
        });
      }

      expect(fn).to.throw('A valid HTML input or textarea element must be provided');
    });
  });

  describe('getUnformattedValue()', function () {
    it('calls the strategy getUnformattedValue method', function () {
      var ri = new RestrictedInput({
        element: document.createElement('input'),
        pattern: '{{a}}'
      });

      global.sandbox.stub(ri.strategy, 'getUnformattedValue');

      ri.getUnformattedValue();

      expect(ri.strategy.getUnformattedValue).to.be.calledOnce;
    });
  });

  describe('setPattern()', function () {
    it('calls the strategy setPattern method', function () {
      var ri = new RestrictedInput({
        element: document.createElement('input'),
        pattern: '{{a}}'
      });

      global.sandbox.stub(ri.strategy, 'setPattern');

      ri.setPattern('{{1}}');

      expect(ri.strategy.setPattern).to.be.calledOnce;
      expect(ri.strategy.setPattern).to.be.calledWith('{{1}}');
    });
  });
});
