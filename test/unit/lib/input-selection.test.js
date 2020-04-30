'use strict';

var getCurrentSelection = require('../../../lib/input-selection').get;

describe('getCurrentSelection', function () {
  describe('element type', function () {
    [
      'input',
      'textarea'
    ].forEach(function (el) {
      it('returns selection range for ' + el, function () {
        var result = getCurrentSelection(document.createElement(el));

        expect(result).to.deep.equal({
          start: 0,
          end: 0,
          delta: 0
        });
      });
    });
  });
});
