'use strict';

var Formatter = require('../../../../lib/formatter');
var NON_AMEX_CARD_PATTERN = '{{9999}} {{9999}} {{9999}} {{9999}}';
var FAKE_PATTERN = '{{99}}-{{99}}';

function noop() {}

describe('Formatter', function () {
  describe('constructor()', function () {
    [
      undefined, // eslint-disable-line
      null,
      1,
      true,
      {},
      noop
    ].forEach(function (test) {
      it('throws if ' + test + ' is passed as pattern', function () {
        expect(function () {
          return new Formatter(test);
        }).to.throw('A valid pattern string is required');
      });
    });

    it('sets a pattern', function () {
      expect(new Formatter('{{9}}').pattern).to.deep.equal([{
        value: /\d/,
        isPermaChar: false,
        index: 0
      }]);
    });
  });

  describe('format()', function () {
    it('moves selection to the correct position when modifying input', function () {
      var formatter = new Formatter('--{{9}}x{{a}}z');
      var options = {
        selection: {start: 2, end: 2},
        value: '8b'
      };
      var result = formatter.format(options);

      expect(result.value).to.equal('--8xbz');
      expect(result.selection.start).to.equal(6);
      expect(result.selection.end).to.equal(6);
    });

    it('can move selection across permaChars', function () {
      var formatter = new Formatter('{{99}} / {{99}}');
      var options = {
        selection: {start: 3, end: 3},
        value: '102'
      };

      expect(formatter.format(options).value).to.equal('10 / 2');
      expect(formatter.format(options).selection).to.deep.equal({
        start: 6,
        end: 6
      });
    });

    it('can keep selection in place if before a permaChar', function () {
      var formatter = new Formatter('{{99}} / {{99}}');
      var options = {
        selection: {start: 1, end: 1},
        value: '102'
      };

      expect(formatter.format(options).value).to.equal('10 / 2');
      expect(formatter.format(options).selection).to.deep.equal({
        start: 1,
        end: 1
      });
    });

    it('can format and re-unformat to get the same result', function () {
      var formatter = new Formatter('{{9999}} {{9999}}');
      var options = {
        selection: {start: 5, end: 5},
        value: '123456'
      };

      var formatted = formatter.format(options);
      var reunformatted = formatter.unformat(formatted);

      expect(reunformatted.selection.start).to.equal(options.selection.start);
      expect(reunformatted.selection.end).to.equal(options.selection.end);
      expect(reunformatted.value).to.equal(options.value);
    });

    describe('formatting', function () {
      [
        {input: '4', output: '4', pattern: NON_AMEX_CARD_PATTERN},
        {input: '41', output: '41', pattern: NON_AMEX_CARD_PATTERN},
        {input: '411', output: '411', pattern: NON_AMEX_CARD_PATTERN},
        {input: '4111', output: '4111 ', pattern: NON_AMEX_CARD_PATTERN},
        {input: '4111111111111111', output: '4111 1111 1111 1111', pattern: NON_AMEX_CARD_PATTERN},
        {input: '94819849871', output: '9481 9849 871', pattern: NON_AMEX_CARD_PATTERN},
        {input: '1', output: '1'},
        {input: '12', output: '12-'},
        {input: '123', output: '12-3'},
        {input: '9', output: '9', pattern: '{{9}}'},
        {input: '8', output: '--8x', pattern: '--{{9}}x{{a}}z'},
        {input: '8b', output: '--8xbz', pattern: '--{{9}}x{{a}}z'},
        {input: '', output: '--', pattern: '--{{9}}x{{a}}z'},
        {input: '9238923', output: '92-38'},
        {input: '11bb', output: '11 bb', pattern: '{{99}} {{aa}}'},
        {input: 'aaaa', output: '', pattern: '{{99}} {{AA}}'},
        {input: '9999', output: '99 99', pattern: '{{23}} {{45}}'},
        {input: '9999', output: '', pattern: '{{BB}} {{AA}}'},
        {input: '9999', output: '', pattern: '{{B}}-{{B}}_///{{AA}}'},
        {input: '9999', output: '--', pattern: '--{{B}}-{{B}}_///{{AA}}'},
        {input: 'CBAA', output: '--C-B_///AA', pattern: '--{{C}}-{{B}}_///{{AA}}'},
        {input: 'a1b2z', output: 'a--_1/b2z', pattern: '{{A}}--_{{9}}/{{A}}{{9}}{{A}}'},
        {input: '!#$%&--', output: '', pattern: NON_AMEX_CARD_PATTERN},
        {input: '4!#$%&--', output: '4', pattern: NON_AMEX_CARD_PATTERN},
        {input: '4!#$%5&--', output: '45', pattern: NON_AMEX_CARD_PATTERN},
        {input: 'A', output: 'A', pattern: '{{*}}'},
        {input: '9', output: '9', pattern: '{{*}}'},
        {input: '98', output: '9', pattern: '{{*}}'},
        {input: '!8', output: '!', pattern: '{{*}}'}
      ].forEach(function (test) {
        var pattern = test.pattern || FAKE_PATTERN;

        it('injects permaChars for ' + test.input + ' with ' + pattern, function () {
          var formatter = new Formatter(pattern);
          var options = {
            selection: {
              start: test.input.length,
              end: test.input.length
            },
            value: test.input
          };

          expect(formatter.format(options).value).to.equal(test.output);
        });
      });
    });

    describe('selection', function () {
      it('updates selection position', function () {
        var formatter = new Formatter(NON_AMEX_CARD_PATTERN);
        var input = '4111';
        var inputSelection = {
          start: 3,
          end: 4
        };
        var outputSelection = {
          start: 3,
          end: 5
        };
        var options = {
          selection: inputSelection,
          value: input
        };

        expect(formatter.format(options).selection).to.deep.equal(outputSelection);
      });

      it('updates selection with multiple permaChars', function () {
        var formatter = new Formatter(NON_AMEX_CARD_PATTERN);
        var input = '41111111111';
        var inputSelection = {
          start: 5,
          end: 11
        };
        var outputSelection = {
          start: 6,
          end: 13
        };
        var options = {
          selection: inputSelection,
          value: input
        };

        expect(formatter.format(options).selection).to.deep.equal(outputSelection);
      });
    });
  });

  describe('unformat()', function () {
    it('returns an unformatted string', function () {
      var formatter = new Formatter('--{{9}}x{{9}}z');
      var options = {
        selection: {start: 3, end: 3},
        value: '--8x9z'
      };

      expect(formatter.unformat(options).value).to.equal('89');
      expect(formatter.unformat(options).selection).to.deep.equal({
        start: 1,
        end: 1,
        delta: 0
      });
    });

    it('disambiguates between a permachar and a non-permachar', function () {
      var formatter = new Formatter('--{{9}}x{{a}}z');
      var options = {
        selection: {start: 1, end: 1},
        value: '--8xbz'
      };

      expect(formatter.unformat(options).value).to.equal('8b');
      expect(formatter.unformat(options).selection).to.deep.equal({
        start: 0,
        end: 0,
        delta: 0
      });
    });

    it('can unformat and re-format to get the same result', function () {
      var formatter = new Formatter('{{9999}} {{9999}}');
      var options = {
        selection: {start: 6, end: 6},
        value: '1234 56'
      };

      var unformatted = formatter.unformat(options);
      var reformatted = formatter.format(unformatted);

      expect(reformatted).to.deep.equal(options);
    });
  });

  describe('setPattern()', function () {
    it('updates instance pattern', function () {
      var formatter = new Formatter('{{9}}');

      formatter.setPattern('{{A}} {{9}}');

      expect(formatter.pattern).to.deep.equal([{
        value: /[A-Za-z]/,
        isPermaChar: false,
        index: 0
      }, {
        value: ' ',
        isPermaChar: true,
        index: 1
      }, {
        value: /\d/,
        isPermaChar: false,
        index: 2
      }]);
    });
  });
});
