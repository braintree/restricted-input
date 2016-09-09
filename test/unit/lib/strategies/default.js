'use strict';

var DefaultStrategy = require('../../../../lib/strategies/default');

describe('Default Strategy', function () {
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
    it('adds input listeners', function () {
      var strategy = new DefaultStrategy(this.options);

      ['keydown', 'keypress', 'keyup', 'input', 'paste'].forEach(function (event) {
        expect(strategy.inputElement.addEventListener).to.be.calledWith(event, global.sandbox.match.func);
      });
    });
  });

  describe('getUnformattedValue()', function () {
    it('returns the value if already unformatted', function () {
      var strategy = new DefaultStrategy(this.options);

      strategy.isFormatted = false;

      expect(strategy.getUnformattedValue()).to.equal('input value');
    });

    it('returns the unformatted value if formatted', function () {
      var strategy = new DefaultStrategy(this.options);

      strategy.isFormatted = true;
      global.sandbox.stub(strategy.formatter, 'unformat').returns({value: 'unformatted value'});

      expect(strategy.getUnformattedValue()).to.equal('unformatted value');
    });

    it('returns the unformatted value if unformatted but force is set to true', function () {
      var strategy = new DefaultStrategy(this.options);

      strategy.isFormatted = false;
      global.sandbox.stub(strategy.formatter, 'unformat').returns({value: 'unformatted value'});

      expect(strategy.getUnformattedValue(true)).to.equal('unformatted value');
    });
  });

  describe('setPattern()', function () {
    it('sets a new pattern', function () {
      var strategy = new DefaultStrategy(this.options);
      var oldFormatter = strategy.formatter;

      strategy.setPattern('{{111}}');

      expect(strategy.formatter).to.not.equal(oldFormatter);
    });

    it('reformats input', function () {
      var strategy = new DefaultStrategy(this.options);

      strategy.setPattern('{{aa}}x-1{{aa}}');

      expect(strategy.inputElement.value).to.equal('inx-1pu');
    });
  });
});
