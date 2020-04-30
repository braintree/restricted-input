'use strict';

var isDelete = require('../../../lib/is-delete');

describe('isDelete()', function () {
  it('returns true if key is "Delete"', function () {
    expect(isDelete({key: 'Delete', keyCode: 0})).to.be.true;
  });

  it('returns true if key is "Del"', function () {
    expect(isDelete({key: 'Del', keyCode: 0})).to.be.true;
  });

  it('returns true if keyCode is 46', function () {
    expect(isDelete({key: 'Not Delete', keyCode: 46})).to.be.true;
  });

  it('returns false if key is not "Del" or "Delete" and keyCode is not 46', function () {
    expect(isDelete({key: 'Not Delete', keyCode: 0})).to.be.false;
  });
});
