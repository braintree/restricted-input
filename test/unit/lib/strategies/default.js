'use strict';

var defaultStrategy = require('../../../../lib/strategies/default');

describe('Default Strategy', function () {
  beforeEach(function () {
    this.restrictedInput = {
      inputElement: {
        addEventListener: sandbox.stub()
      }
    };
  });

  it('adds input listeners', function () {
    defaultStrategy(this.restrictedInput);

    ['keydown', 'keypress', 'keyup', 'input', 'paste'].forEach(function (event) {
      expect(this.restrictedInput.inputElement.addEventListener).to.be.calledWith(event, sandbox.match.func);
    }.bind(this));
  });
});
