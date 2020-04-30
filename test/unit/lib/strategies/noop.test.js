'use strict';

var NoopStrategy = require('../../../../lib/strategies/noop');
var BaseStrategy = require('../../../../lib/strategies/base');

describe('Noop Strategy', function () {
  it('has the same public methods as Base Strategy', function () {
    var noopPublicMethods = Object.getOwnPropertyNames(NoopStrategy.prototype).filter(function (property) {
      return typeof NoopStrategy.prototype[property] === 'function' && property[0] !== '_';
    });
    var basePublicMethods = Object.getOwnPropertyNames(BaseStrategy.prototype).filter(function (property) {
      return typeof BaseStrategy.prototype[property] === 'function' && property[0] !== '_';
    });

    expect(noopPublicMethods.length > 0).to.equal(true);
    expect(noopPublicMethods.length).to.equal(basePublicMethods.length);
    basePublicMethods.forEach(function (method) {
      expect(noopPublicMethods).to.contain(method);
    });
  });
});
