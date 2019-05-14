'use strict';

describe('Restricted Input', function () {
  this.retries(2);

  beforeEach(function () {
    browser.url('http://bs-local.com:3099');

    this.repeat = function (action, numberOfTimes) {
      var count = 0;

      while (count < numberOfTimes) {
        action();

        count++;
      }
    };
    this.getSelectionRange = function (id) {
      return browser.execute(function (nodeId) {
        var el = document.getElementById(nodeId);

        return {
          start: el.selectionStart,
          end: el.selectionEnd
        };
      }, id);
    };
    this.sendKeys = function (keys) {
      // Safari has trouble if you send more than a key at once :/
      // also, it doesn't like using `split` to make this an array and call forEach on it???? :dazed:
      for (var i = 0; i < keys.length; i++) {
        browser.keys(keys[i]);
      };
    }
  });

  describe('for number', function () {
    it('enters a credit card', function () {
      var input = $('#credit-card-number');

      input.click();

      this.sendKeys('4111111111111111');

      expect(input.getValue()).to.equal('4111 1111 1111 1111');
    });

    it('only allows digits', function () {
      var input = $('#credit-card-number');

      input.click();

      this.sendKeys('abc');
      this.sendKeys('defghhijklmnopqrstuvwxyz !@#$%^&*()_=+');
      this.sendKeys('1234567890123456');

      expect(input.getValue()).to.equal('1234 5678 9012 3456');
    });

    it('limits input size', function () {
      var input = $('#credit-card-number');

      input.click();

      this.sendKeys('41111111111111111234567890123456');

      expect(input.getValue()).to.equal('4111 1111 1111 1111');
    });

    it('should enter a space when expected gap', function () {
      var input = $('#credit-card-number');

      input.click();

      this.sendKeys('4111');

      expect(input.getValue()).to.equal('4111 ');

      this.sendKeys('1');

      expect(input.getValue()).to.equal('4111 1');
    });

    it('should keep the space when removing digit after gap', function () {
      var input = $('#credit-card-number');

      input.click();

      this.sendKeys('41115');

      expect(input.getValue()).to.equal('4111 5');

      this.sendKeys('Backspace');

      expect(input.getValue()).to.equal('4111 ');
    });

    it('backspacing after a gap should change the value', function () {
      var input = $('#credit-card-number');

      input.click();

      this.sendKeys('41115');

      browser.keys('ArrowLeft');
      browser.keys('Backspace');

      expect(input.getValue()).to.equal('4115 ');
    });

    it('backspacing before a gap backspaces a character', function () {
      var input = $('#credit-card-number');

      input.click();

      this.sendKeys('41115');

      expect(input.getValue()).to.equal('4111 5');

      browser.keys('ArrowLeft');
      browser.keys('ArrowLeft');
      browser.keys('Backspace');

      expect(input.getValue()).to.equal('4115 ');
    });

    it('backspacing the character after a gap should keep the cursor after the gap', function () {
      var selection;
      var input = $('#credit-card-number');

      input.click();

      this.sendKeys('411156');

      expect(input.getValue()).to.equal('4111 56');

      browser.keys('ArrowLeft');
      browser.keys('Backspace');

      expect(input.getValue()).to.equal('4111 6');

      selection = this.getSelectionRange('credit-card-number');
      expect(selection.start).to.equal(5);
      expect(selection.end).to.equal(5);
    });

    it('backspacing the character before a gap should backspace the character and move the gap', function () {
      var selection;
      var input = $('#credit-card-number');

      input.click();

      this.sendKeys('411156');

      expect(input.getValue()).to.equal('4111 56');

      browser.keys('ArrowLeft');
      browser.keys('ArrowLeft');
      browser.keys('ArrowLeft');
      browser.keys('Backspace');

      expect(input.getValue()).to.equal('4115 6');

      selection = this.getSelectionRange('credit-card-number');
      expect(selection.start).to.equal(3);
      expect(selection.end).to.equal(3);
    });

    it('field overwrites', function () {
      var input = $('#credit-card-number');

      input.click();

      this.sendKeys('1111111111111111');

      expect(input.getValue()).to.equal('1111 1111 1111 1111');

      this.repeat(function () {
        browser.keys('ArrowLeft');
      }, 19);

      this.sendKeys('2222222222222222');

      expect(input.getValue()).to.equal('2222 2222 2222 2222');
    });

    it('can backspace a whole field', function () {
      var input = $('#credit-card-number');

      input.click();

      this.sendKeys('1111111111111111');
      expect(input.getValue()).to.equal('1111 1111 1111 1111');

      this.repeat(function () {
        browser.keys('Backspace');
      }, 16);
      expect(input.getValue()).to.equal('');
    });

    it('can backspace in the middle', function () {
      var input = $('#credit-card-number');

      input.click();

      this.sendKeys('1234567890123456');

      expect(input.getValue()).to.equal('1234 5678 9012 3456');

      this.repeat(function () {
        browser.keys('ArrowLeft');
      }, 11);

      browser.keys('Backspace');
      expect(input.getValue()).to.equal('1234 5689 0123 456');
    });

    it.only('can delete after a gap', function () {
      var selection;
      var input = $('#credit-card-number');

      input.click();

      this.sendKeys('123456');

      expect(input.getValue()).to.equal('1234 56');
      browser.keys('ArrowLeft');
      browser.keys('ArrowLeft');

      selection = this.getSelectionRange('credit-card-number');
      expect(selection.start).to.equal(5);
      expect(selection.end).to.equal(5);

      browser.keys('Delete');

      expect(input.getValue()).to.equal('1234 6');

      selection = this.getSelectionRange('credit-card-number');
      expect(selection.start).to.equal(5);
      expect(selection.end).to.equal(5);
    });

    it('can delete before a gap', function () {
      var selection;
      var input = $('#credit-card-number');

      input.click();

      this.sendKeys('12345');

      expect(input.getValue()).to.equal('1234 5');

      browser.keys('ArrowLeft');
      browser.keys('ArrowLeft');

      selection = this.getSelectionRange('credit-card-number');
      expect(selection.start).to.equal(4);
      expect(selection.end).to.equal(4);

      browser.keys('Delete');
      expect(input.getValue()).to.equal('1234 ');

      selection = this.getSelectionRange('credit-card-number');
      expect(selection.start).to.equal(5);
      expect(selection.end).to.equal(5);
    });

    it('can prepend the first four digits', function () {
      var selection;
      var input = $('#credit-card-number');

      input.click();

      this.sendKeys('412345678');

      expect(input.getValue()).to.equal('4123 4567 8');

      selection = this.getSelectionRange('credit-card-number');
      expect(selection.start).to.equal(11);
      expect(selection.end).to.equal(11);

      this.repeat(function () {
        browser.keys('ArrowLeft');
      }, input.getValue().length);

      this.sendKeys('0000');

      expect(input.getValue()).to.equal('0000 4123 4567 8');

      selection = this.getSelectionRange('credit-card-number');
      expect(selection.start).to.equal(5);
      expect(selection.end).to.equal(5);
    });

    it('doesnt overwrite when more digits can fit in the field', function () {
      var selection;
      var input = $('#credit-card-number');

      input.click();

      this.sendKeys('1234567');

      expect(input.getValue()).to.equal('1234 567');

      selection = this.getSelectionRange('credit-card-number');
      expect(selection.start).to.equal(8);
      expect(selection.end).to.equal(8);

      this.repeat(function () {
        browser.keys('ArrowLeft');
      }, input.getValue().length);

      this.sendKeys('0000');

      expect(input.getValue()).to.equal('0000 1234 567');

      selection = this.getSelectionRange('credit-card-number');
      expect(selection.start).to.equal(5);
      expect(selection.end).to.equal(5);
    });

    it('pre-formats on initialization', function () {
      var input = $('#prefilled-credit-card-number');

      input.click();

      expect(input.getValue()).to.equal('4111 1111 1111 1111');
    });
  });

  describe('for amex', function () {
    it('enters a credit card', function () {
      var input = $('#credit-card-amex');

      input.click();

      this.sendKeys('378211111111111');

      expect(input.getValue()).to.equal('3782 111111 11111');
    });

    it('only allows digits', function () {
      var input = $('#credit-card-amex');

      input.click();

      this.sendKeys('abc');
      this.sendKeys('defghhijklmnopqrstuvwxyz !@#$%^&*()_=+');
      this.sendKeys('1234567890123456');

      expect(input.getValue()).to.equal('1234 567890 12345');
    });

    it('limits input size', function () {
      var input = $('#credit-card-amex');

      input.click();

      this.sendKeys('3782111111111111234567890123456');

      expect(input.getValue()).to.equal('3782 111111 11111');
    });

    it('should enter a space for expected gap', function () {
      var input = $('#credit-card-amex');

      input.click();

      this.sendKeys('3782');

      expect(input.getValue()).to.equal('3782 ');
      this.sendKeys('1');

      expect(input.getValue()).to.equal('3782 1');
    });

    it('should keep the space when removing digit after gap', function () {
      var input = $('#credit-card-amex');

      input.click();

      this.sendKeys('37825');

      expect(input.getValue()).to.equal('3782 5');
      browser.keys('Backspace');
      expect(input.getValue()).to.equal('3782 ');
    });

    it('backspacing after a gap should change the value', function () {
      var input = $('#credit-card-amex');

      input.click();

      this.sendKeys('37828');

      expect(input.getValue()).to.equal('3782 8');
      browser.keys('ArrowLeft');
      browser.keys('Backspace');
      expect(input.getValue()).to.equal('3788 ');
    });

    it('backspacing before a gap backspaces a character and fills the gap', function () {
      var input = $('#credit-card-amex');

      input.click();

      this.sendKeys('37825');

      expect(input.getValue()).to.equal('3782 5');
      browser.keys('ArrowLeft');
      browser.keys('ArrowLeft');
      browser.keys('Backspace');
      expect(input.getValue()).to.equal('3785 ');
    });

    it('backspacing the character before a gap should backspace the character and move the gap', function () {
      var selection;
      var input = $('#credit-card-amex');

      input.click();

      this.sendKeys('378256');

      expect(input.getValue()).to.equal('3782 56');
      browser.keys('ArrowLeft');
      browser.keys('ArrowLeft');
      browser.keys('ArrowLeft');
      browser.keys('Backspace');
      expect(input.getValue()).to.equal('3785 6');

      selection = this.getSelectionRange('credit-card-amex');
      expect(selection.start).to.equal(3);
      expect(selection.end).to.equal(3);
    });

    it('field overwrites', function () {
      var input = $('#credit-card-amex');

      input.click();

      this.sendKeys('111111111111111');

      expect(input.getValue()).to.equal('1111 111111 11111');
      this.repeat(function () {
        browser.keys('ArrowLeft');
      }, 17);
      this.sendKeys('2222222222222222');

      expect(input.getValue()).to.equal('2222 222222 22222');
    });

    it('can backspace a whole field', function () {
      var input = $('#credit-card-amex');

      input.click();

      this.sendKeys('111111111111111');

      expect(input.getValue()).to.equal('1111 111111 11111');
      this.repeat(function () {
        browser.keys('Backspace');
      }, 15);
      expect(input.getValue()).to.equal('');
    });

    it('can backspace in the middle', function () {
      var input = $('#credit-card-amex');

      input.click();

      this.sendKeys('123456789012345');

      expect(input.getValue()).to.equal('1234 567890 12345');
      this.repeat(function () {
        browser.keys('ArrowLeft');
      }, 10);
      browser.keys('Backspace');
      expect(input.getValue()).to.equal('1234 578901 2345');
    });

    it('can delete after a gap', function () {
      var selection;
      var input = $('#credit-card-amex');

      input.click();

      this.sendKeys('123456');

      expect(input.getValue()).to.equal('1234 56');
      browser.keys('ArrowLeft');
      browser.keys('ArrowLeft');

      selection = this.getSelectionRange('credit-card-amex');
      expect(selection.start).to.equal(5);
      expect(selection.end).to.equal(5);

      browser.keys('Delete');
      expect(input.getValue()).to.equal('1234 6');

      selection = this.getSelectionRange('credit-card-amex');
      expect(selection.start).to.equal(5);
      expect(selection.end).to.equal(5);
    });

    it('can delete before a gap', function () {
      var selection;
      var input = $('#credit-card-amex');

      input.click();

      this.sendKeys('12345');

      expect(input.getValue()).to.equal('1234 5');
      browser.keys('ArrowLeft');
      browser.keys('ArrowLeft');

      selection = this.getSelectionRange('credit-card-amex');
      expect(selection.start).to.equal(4);
      expect(selection.end).to.equal(4);

      browser.keys('Delete');
      expect(input.getValue()).to.equal('1234 ');

      selection = this.getSelectionRange('credit-card-amex');
      expect(selection.start).to.equal(5);
      expect(selection.end).to.equal(5);
    });

    it('can prepend the first four digits', function () {
      var input = $('#credit-card-amex');
      var selection;

      input.click();

      this.sendKeys('412345678');

      expect(input.getValue()).to.equal('4123 45678');

      selection = this.getSelectionRange('credit-card-amex');
      expect(selection.start).to.equal(10);
      expect(selection.end).to.equal(10);

      this.repeat(function () {
        browser.keys('ArrowLeft');
      }, input.getValue().length);
      this.sendKeys('0000');

      expect(input.getValue()).to.equal('0000 412345 678');

      selection = this.getSelectionRange('credit-card-amex');
      expect(selection.start).to.equal(5);
      expect(selection.end).to.equal(5);
    });

    it('doesnt overwrite when more digits can fit in the field', function () {
      var selection;
      var input = $('#credit-card-amex');

      input.click();

      this.sendKeys('1234567');

      expect(input.getValue()).to.equal('1234 567');

      selection = this.getSelectionRange('credit-card-amex');
      expect(selection.start).to.equal(8);
      expect(selection.end).to.equal(8);

      this.repeat(function () {
        browser.keys('ArrowLeft');
      }, input.getValue().length);
      this.sendKeys('0000');

      expect(input.getValue()).to.equal('0000 123456 7');

      selection = this.getSelectionRange('credit-card-amex');
      expect(selection.start).to.equal(5);
      expect(selection.end).to.equal(5);
    });
  });

  describe('for unformatted', function () {
    it('enters a credit card', function () {
      var input = $('#credit-card-unformatted');

      input.click();

      this.sendKeys('4111111111111111');

      expect(input.getValue()).to.equal('4111111111111111');
    });

    it('only allows digits', function () {
      var input = $('#credit-card-unformatted');

      input.click();

      this.sendKeys('abc');

      this.sendKeys('defghhijklmnopqrstuvwxyz !@#$%^&*()_=+');

      this.sendKeys('1234567890123456');

      expect(input.getValue()).to.equal('1234567890123456');
    });

    it('limits input size', function () {
      var input = $('#credit-card-unformatted');

      input.click();

      this.sendKeys('41111111111111111234567890123456');

      expect(input.getValue()).to.equal('4111111111111111');
    });

    it('field overwrites', function () {
      var input = $('#credit-card-unformatted');

      input.click();

      this.sendKeys('1111111111111111');

      expect(input.getValue()).to.equal('1111111111111111');
      this.repeat(function () {
        browser.keys('ArrowLeft');
      }, 16);
      this.sendKeys('2222222222222222');

      expect(input.getValue()).to.equal('2222222222222222');
    });

    it('can backspace a whole field', function () {
      var input = $('#credit-card-unformatted');

      input.click();

      this.sendKeys('1111111111111111');

      expect(input.getValue()).to.equal('1111111111111111');
      this.repeat(function () {
        browser.keys('Backspace');
      }, 16);
      expect(input.getValue()).to.equal('');
    });

    it('can backspace in the middle', function () {
      var input = $('#credit-card-unformatted');

      input.click();

      this.sendKeys('1234567890123456');

      expect(input.getValue()).to.equal('1234567890123456');
      this.repeat(function () {
        browser.keys('ArrowLeft');
      }, 9);

      browser.keys('Backspace');
      expect(input.getValue()).to.equal('123456890123456');
    });
  });

  describe('for toggle-able', function () {
    it('toggles', function () {
      var input = $('#credit-card-toggle-able');
      var button = $('#credit-card-toggle-able-btn');

      input.click();

      this.sendKeys('4111111111111111');

      expect(input.getValue()).to.equal('4111 1111 1111 1111');

      button.click();

      expect(input.getValue()).to.equal('4111 111111 11111');
    });
  });

  describe('wildcard', function () {
    it('accepts digits', function () {
      var input = $('#wildcard');

      input.click();

      this.sendKeys('3333');

      expect(input.getValue()).to.equal('*A*3 3');
    });

    it('accepts lowercase alpha', function () {
      var input = $('#wildcard');

      input.click();

      this.sendKeys('jjjj');

      expect(input.getValue()).to.equal('*A*3 jjj');
    });

    it('accepts uppercase alpha', function () {
      var input = $('#wildcard');

      input.click();

      this.sendKeys('NNNN');

      expect(input.getValue()).to.equal('*A*3 NNN');
    });

    it('accepts mixed alphanumeric', function () {
      var input = $('#wildcard');

      input.click();

      this.sendKeys('aZ54');

      expect(input.getValue()).to.equal('*A*3 aZ54');
    });
  });
});
