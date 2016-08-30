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

    it('sets inputElement property', function () {
      var element = document.createElement('input');
      var ri = global.getCleanInstance({element: element});

      expect(ri.inputElement).to.deep.equal(element);
    });

    it('sets restriction pattern', function () {
      var pattern = 'ptrn';
      var ri = global.getCleanInstance({pattern: pattern});

      expect(ri.pattern).to.equal(pattern);
    });
  });

  describe('getUnformattedValue', function () {
    it('returns the value from formatter.unformat', function () {
      var actual;
      var context = {
        inputElement: {value: 'input value'},
        formatter: {unformat: function () { return {value: 'unformatted'}; }}
      };

      actual = RestrictedInput.prototype.getUnformattedValue.call(context);

      expect(actual).to.equal('unformatted');
    });
  });
});
