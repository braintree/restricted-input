beforeEach(function () {
  document.body.innerHTML = "";
  // jsdom 26 adds ontouchend to document, causing Mac UAs to be falsely detected
  // as iPadOS in @braintree/browser-detection's isIos(). Remove it to simulate
  // a non-touch desktop browser environment.
  delete (document as any).ontouchend;
  delete (Document.prototype as any).ontouchend;
});

afterEach(function () {
  jest.restoreAllMocks();
});
