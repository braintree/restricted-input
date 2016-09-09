'use strict';

var IosStrategy = require('../../../../lib/strategies/ios');
var DefaultStrategy = require('../../../../lib/strategies/default');

describe('iOS Strategy', function () {
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
    it('is an instance of DefaultStrategy', function () {
      var strategy = new IosStrategy(this.options);

      expect(strategy).to.be.an.instanceof(DefaultStrategy);
    });

    it('adds ios specific listeners', function () {
      var strategy = new IosStrategy(this.options);

      ['keydown', 'input', 'focus'].forEach(function (event) {
        expect(strategy.inputElement.addEventListener).to.be.calledWith(event, global.sandbox.match.func);
      });
    });
  });

  describe('getUnformattedValue', function () {
    it('always returns the unformatted value', function () {
      var strategy = new IosStrategy(this.options);

      global.sandbox.stub(strategy.formatter, 'unformat').returns({value: 'unformatted value'});

      expect(strategy.getUnformattedValue()).to.equal('unformatted value');
    });
  });
});
