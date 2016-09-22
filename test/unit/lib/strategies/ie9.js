'use strict';

var IE9Strategy = require('../../../../lib/strategies/ie9');
var BaseStrategy = require('../../../../lib/strategies/base');

describe('IE9 Strategy', function () {
  beforeEach(function () {
    this.options = {
      element: {
        value: 'input value',
        addEventListener: global.sandbox.stub()
      },
      pattern: '{{9}}'
    };
  });

  describe('constructor()', function () {
    it('is an instance of BaseStrategy', function () {
      var strategy = new IE9Strategy(this.options);

      expect(strategy).to.be.an.instanceof(BaseStrategy);
    });

    it('adds IE9 specific listeners', function () {
      var strategy = new IE9Strategy(this.options);

      ['keydown', 'paste', 'focus'].forEach(function (event) {
        expect(strategy.inputElement.addEventListener).to.be.calledWith(event, global.sandbox.match.func);
      });
    });
  });

  describe('getUnformattedValue', function () {
    it('always returns the unformatted value', function () {
      var strategy = new IE9Strategy(this.options);

      global.sandbox.stub(strategy.formatter, 'unformat').returns({value: 'unformatted value'});

      expect(strategy.getUnformattedValue()).to.equal('unformatted value');
    });
  });
});
