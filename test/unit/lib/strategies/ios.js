'use strict';

var iosStrategy = require('../../../../lib/strategies/ios');

describe('iOS Strategy', function () {
  beforeEach(function () {
    this.restrictedInput = {
      inputElement: {
        addEventListener: sandbox.stub()
      }
    };
  });

  it('adds listeners', function () {
    iosStrategy(this.restrictedInput);

    ['keydown', 'input', 'focus'].forEach(function (event) {
      expect(this.restrictedInput.inputElement.addEventListener).to.be.calledWith(event, sandbox.match.func);
    }.bind(this));
  });
});
