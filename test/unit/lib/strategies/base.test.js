'use strict';

var BaseStrategy = require('../../../../lib/strategies/base');

describe('Base Strategy', function () {
  var options;

  beforeEach(function () {
    options = {
      element: {
        value: 'input value',
        addEventListener: jest.fn()
      },
      pattern: '{{CCCCC}} {{CCCCC}}'
    };
  });

  describe('constructor()', function () {
    it('adds input listeners', function () {
      var strategy = new BaseStrategy(options);

      ['keydown', 'keypress', 'keyup', 'input', 'paste'].forEach(function (event) {
        expect(strategy.inputElement.addEventListener).toBeCalledWith(event, expect.any(Function));
      });
    });
  });

  describe('getUnformattedValue()', function () {
    it('returns the value if already unformatted', function () {
      var strategy = new BaseStrategy(options);

      expect(strategy.inputElement.value).toBe('input value');
      expect(strategy.getUnformattedValue()).toBe('inputvalue');
    });

    it('returns the unformatted value if formatted', function () {
      var strategy = new BaseStrategy(options);

      strategy.isFormatted = true;
      jest.spyOn(strategy.formatter, 'unformat').mockReturnValue({value: 'unformatted value'});

      expect(strategy.getUnformattedValue()).toBe('unformatted value');
    });

    it('returns the unformatted value if unformatted but force is set to true', function () {
      var strategy = new BaseStrategy(options);

      strategy.isFormatted = false;
      jest.spyOn(strategy.formatter, 'unformat').mockReturnValue({value: 'unformatted value'});

      expect(strategy.getUnformattedValue(true)).toBe('unformatted value');
    });
  });

  describe('setPattern()', function () {
    it('sets a new pattern', function () {
      var strategy = new BaseStrategy(options);
      var oldFormatter = strategy.formatter;

      strategy.setPattern('{{111}}');

      expect(strategy.formatter).not.toBe(oldFormatter);
    });

    it('reformats input if it is not empty', function () {
      var strategy = new BaseStrategy(options);

      strategy.setPattern('{{aa}}x-1{{aa}}');

      expect(strategy.inputElement.value).toBe('inx-1pu');
    });

    it('does not reformat input if it is empty', function () {
      var strategy = new BaseStrategy(options);

      strategy.inputElement.value = '';
      strategy.setPattern('{{aa}}x-1{{aa}}');

      expect(strategy.inputElement.value).toBe('');
    });
  });
});
