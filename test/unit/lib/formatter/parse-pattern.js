'use strict';

var parsePattern = require('../../../../lib/formatter/parse-pattern');

describe('parsePattern', function () {
  it('returns a collection of objects', function () {
    var parsed = parsePattern('{{9999}} {{9999}}');

    expect(parsed).to.be.an.array;
    expect(parsed).to.have.length(9);
    expect(parsed[0]).to.deep.equal({
      value: /\d/,
      isPermaChar: false,
      index: 0
    });
    expect(parsed[4]).to.deep.equal({
      value: ' ',
      isPermaChar: true,
      index: 4
    });
  });

  describe('wildcard pattern', function () {
    it('takes a wildcard pattern', function () {
      expect(parsePattern('{{*}}')[0].value).to.deep.equal(/./);
    });
  });

  describe('digit patterns', function () {
    '0123456789'.split('').forEach(function (test) {
      it('creates a regex for digits with ' + test, function () {
        expect(parsePattern('{{' + test + '}}')[0].value).to.deep.equal(/\d/);
      });
    });
  });

  describe('non-digit patterns', function () {
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('').forEach(function (test) {
      it('creates a regex for non-digits with ' + test, function () {
        expect(parsePattern('{{' + test + '}}')[0].value).to.deep.equal(/[A-Za-z]/);
      });
    });
  });

  describe('invalid patterns', function () {
    [
      '{{-}}',
      '{{_}}',
      '{{!}}',
      '{{@}}',
      '{{#}}',
      '{{$}}',
      '{{%}}',
      '{{^}}',
      '{{&}}',
      '{{(}}',
      '{{)}}',
      '{{+}}',
      '{{?}}',
      '{{>}}',
      '{{<}}',
      '{{,}}',
      '{{.}}',
      '{{\'}}',
      '{{"}}',
      '{{\\}}',
      '{{\/}}',
      '{{A--}}',
      '{{9999}} {{99-9}}'
    ].forEach(function (test) {
      it('throws for ' + test, function () {
        expect(function () {
          parsePattern(test);
        }).to.throw('Only alphanumeric or wildcard pattern matchers are allowed');
      });
    });
  });
});
