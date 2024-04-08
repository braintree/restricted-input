describe("Restricted Input", function () {
  before(() => {
    browser.addCommand(
      "repeatKeys",
      async function (key, numberOfTimes) {
        let count = 0;
        const promises = [];

        while (count < numberOfTimes) {
          promises.push(this.keys(key));
          count++;
        }

        await Promise.all(promises);
      },
      true
    );

    browser.addCommand(
      "getSelectionRange",
      async function () {
        // executed in browser, so it must be es5 compliant
        return browser.execute(async function (nodeId) {
          const el = await document.getElementById(nodeId);

          return {
            start: await el.selectionStart,
            end: await el.selectionEnd,
          };
        }, await this.getProperty("id"));
      },
      true
    );

    browser.addCommand(
      "typeKeys",
      async function (keys) {
        await this.addValue(keys);
      },
      true
    );
  });

  beforeEach(() => {
    browser.url("http://localhost:3099");
  });

  describe("for number", () => {
    it("enters a credit card", async () => {
      const input = await $("#credit-card-number");

      await input.typeKeys("4111111111111111");
      const value = await input.getValue();

      expect(value).toBe("4111 1111 1111 1111");
    });

    it("only allows digits", async () => {
      const input = await $("#credit-card-number");

      await input.typeKeys(
        "a12bcdef3ghh4ij56klmn7opqr8stuv9wx0yz !123@#$4%^&*()_=+56"
      );
      const value = await input.getValue();

      expect(value).toBe("1234 5678 9012 3456");
    });

    it("limits input size", async () => {
      const input = await $("#credit-card-number");

      await input.typeKeys("41111111111111111234567890123456");
      const value = await input.getValue();

      expect(value).toBe("4111 1111 1111 1111");
    });

    it("should enter a space when expected gap", async () => {
      const input = await $("#credit-card-number");

      await input.typeKeys("4111");
      let value = await input.getValue();

      expect(value).toBe("4111 ");

      await input.typeKeys("1");
      value = await input.getValue();

      expect(value).toBe("4111 1");
    });

    it("should keep the space when removing digit after gap", async () => {
      const input = await $("#credit-card-number");

      await input.typeKeys("41115");
      let value = await input.getValue();

      expect(value).toBe("4111 5");

      await browser.keys("Backspace");
      value = await input.getValue();

      expect(value).toBe("4111 ");
    });

    it("backspacing after a gap should change the value", async () => {
      const input = await $("#credit-card-number");

      await input.typeKeys("41115");
      await browser.keys("ArrowLeft");
      await browser.keys("Backspace");
      const value = await input.getValue();

      expect(value).toBe("4115 ");
    });

    it("backspacing before a gap backspaces a character", async () => {
      const input = await $("#credit-card-number");

      await input.typeKeys("41115");
      let value = await input.getValue();

      expect(value).toBe("4111 5");

      await browser.keys("ArrowLeft");
      await browser.keys("ArrowLeft");
      await browser.keys("Backspace");
      value = await input.getValue();

      expect(value).toBe("4115 ");
    });

    it("backspacing the character after a gap should keep the cursor after the gap", async () => {
      const input = await $("#credit-card-number");

      await input.typeKeys("411156");
      let value = await input.getValue();

      expect(value).toBe("4111 56");

      await browser.keys("ArrowLeft");
      await browser.keys("Backspace");
      value = await input.getValue();

      expect(value).toBe("4111 6");

      const selection = await input.getSelectionRange();
      expect(selection.start).toBe(5);
      expect(selection.end).toBe(5);
    });

    it("backspacing the character before a gap should backspace the character and move the gap", async () => {
      const input = await $("#credit-card-number");

      await input.typeKeys("411156");
      let value = await input.getValue();

      expect(value).toBe("4111 56");

      await browser.keys("ArrowLeft");
      await browser.keys("ArrowLeft");
      await browser.keys("ArrowLeft");
      await browser.keys("Backspace");
      value = await input.getValue();

      expect(value).toBe("4115 6");

      const selection = await input.getSelectionRange();
      expect(selection.start).toBe(3);
      expect(selection.end).toBe(3);
    });

    it("field overwrites", async () => {
      const input = await $("#credit-card-number");

      await input.typeKeys("1111111111111111");
      let value = await input.getValue();

      expect(value).toBe("1111 1111 1111 1111");

      await input.repeatKeys("ArrowLeft", 19);
      await input.typeKeys("2222222222222222");
      value = await input.getValue();

      expect(value).toBe("2222 2222 2222 2222");
    });

    it("can backspace a whole field", async () => {
      const input = await $("#credit-card-number");

      await input.typeKeys("1111111111111111");
      let value = await input.getValue();

      expect(value).toBe("1111 1111 1111 1111");

      await input.repeatKeys("Backspace", 16);
      value = await input.getValue();

      expect(value).toBe("");
    });

    it("can backspace in the middle", async () => {
      const input = await $("#credit-card-number");

      await input.typeKeys("1234567890123456");
      let value = await input.getValue();

      expect(value).toBe("1234 5678 9012 3456");

      await input.repeatKeys("ArrowLeft", 11);
      await browser.keys("Backspace");
      value = await input.getValue();

      expect(value).toBe("1234 5689 0123 456");
    });

    it("can delete after a gap", async () => {
      let selection;
      const input = await $("#credit-card-number");

      await input.typeKeys("123456");
      let value = await input.getValue();

      expect(value).toBe("1234 56");
      await browser.keys("ArrowLeft");
      await browser.keys("ArrowLeft");

      selection = await input.getSelectionRange();
      expect(selection.start).toBe(5);
      expect(selection.end).toBe(5);

      await browser.keys("Delete");
      value = await input.getValue();

      expect(value).toBe("1234 6");

      selection = await input.getSelectionRange();
      expect(selection.start).toBe(5);
      expect(selection.end).toBe(5);
    });

    it("can delete before a gap", async () => {
      let selection;
      const input = await $("#credit-card-number");

      await input.typeKeys("12345");
      let value = await input.getValue();

      expect(value).toBe("1234 5");

      await browser.keys("ArrowLeft");
      await browser.keys("ArrowLeft");

      selection = await input.getSelectionRange();
      expect(selection.start).toBe(4);
      expect(selection.end).toBe(4);

      await browser.keys("Delete");
      value = await input.getValue();
      expect(value).toBe("1234 ");

      selection = await input.getSelectionRange();
      expect(selection.start).toBe(5);
      expect(selection.end).toBe(5);
    });

    it("can prepend the first four digits", async () => {
      let selection;
      const input = await $("#credit-card-number");

      await input.typeKeys("412345678");
      let value = await input.getValue();

      expect(value).toBe("4123 4567 8");

      selection = await input.getSelectionRange();
      expect(selection.start).toBe(11);
      expect(selection.end).toBe(11);

      value = await input.getValue();
      await input.repeatKeys("ArrowLeft", value.length);

      await input.typeKeys("0000");
      value = await input.getValue();

      expect(value).toBe("0000 4123 4567 8");

      selection = await input.getSelectionRange();
      expect(selection.start).toBe(5);
      expect(selection.end).toBe(5);
    });

    it("does not overwrite when more digits can fit in the field", async () => {
      let selection;
      const input = await $("#credit-card-number");

      await input.typeKeys("1234567");
      let value = await input.getValue();

      expect(value).toBe("1234 567");

      selection = await input.getSelectionRange();
      expect(selection.start).toBe(8);
      expect(selection.end).toBe(8);

      value = await input.getValue();
      await input.repeatKeys("ArrowLeft", value.length);

      await input.typeKeys("0000");
      value = await input.getValue();

      expect(value).toBe("0000 1234 567");

      selection = await input.getSelectionRange();
      expect(selection.start).toBe(5);
      expect(selection.end).toBe(5);
    });

    it("pre-formats on initialization", async () => {
      const input = $("#prefilled-credit-card-number");
      const value = await input.getValue();

      expect(value).toBe("4111 1111 1111 1111");
    });
  });

  describe("for amex", () => {
    it("enters a credit card", async () => {
      const input = await $("#credit-card-amex");

      await input.typeKeys("378211111111111");
      const value = await input.getValue();

      expect(value).toBe("3782 111111 11111");
    });

    it("only allows digits", async () => {
      const input = await $("#credit-card-amex");

      await input.typeKeys(
        "a12bcdef3ghh4ij56klmn7opqr8stuv9wx0yz !123@#$4%^&*()_=+5"
      );
      const value = await input.getValue();

      expect(value).toBe("1234 567890 12345");
    });

    it("limits input size", async () => {
      const input = await $("#credit-card-amex");

      await input.typeKeys("3782111111111111234567890123456");
      const value = await input.getValue();

      expect(value).toBe("3782 111111 11111");
    });

    it("should enter a space for expected gap", async () => {
      const input = await $("#credit-card-amex");

      await input.typeKeys("3782");
      let value = await input.getValue();

      expect(value).toBe("3782 ");

      await input.typeKeys("1");
      value = await input.getValue();

      expect(value).toBe("3782 1");
    });

    it("should keep the space when removing digit after gap", async () => {
      const input = await $("#credit-card-amex");

      await input.typeKeys("37825");
      let value = await input.getValue();

      expect(value).toBe("3782 5");

      await browser.keys("Backspace");
      value = await input.getValue();

      expect(value).toBe("3782 ");
    });

    it("backspacing after a gap should change the value", async () => {
      const input = await $("#credit-card-amex");

      await input.typeKeys("37828");
      let value = await input.getValue();

      expect(value).toBe("3782 8");

      await browser.keys("ArrowLeft");
      await browser.keys("Backspace");
      value = await input.getValue();

      expect(value).toBe("3788 ");
    });

    it("backspacing before a gap backspaces a character and fills the gap", async () => {
      const input = await $("#credit-card-amex");

      await input.typeKeys("37825");
      let value = await input.getValue();

      expect(value).toBe("3782 5");

      await browser.keys("ArrowLeft");
      await browser.keys("ArrowLeft");
      await browser.keys("Backspace");
      value = await input.getValue();

      expect(value).toBe("3785 ");
    });

    it("backspacing the character before a gap should backspace the character and move the gap", async () => {
      const input = await $("#credit-card-amex");

      await input.typeKeys("378256");
      let value = await input.getValue();

      expect(value).toBe("3782 56");

      await browser.keys("ArrowLeft");
      await browser.keys("ArrowLeft");
      await browser.keys("ArrowLeft");
      await browser.keys("Backspace");
      value = await input.getValue();

      expect(value).toBe("3785 6");

      const selection = await input.getSelectionRange();
      expect(selection.start).toBe(3);
      expect(selection.end).toBe(3);
    });

    it("field overwrites", async () => {
      const input = await $("#credit-card-amex");

      await input.typeKeys("111111111111111");
      let value = await input.getValue();

      expect(value).toBe("1111 111111 11111");

      await input.repeatKeys("ArrowLeft", 17);
      await input.typeKeys("2222222222222222");
      value = await input.getValue();

      expect(value).toBe("2222 222222 22222");
    });

    it("can backspace a whole field", async () => {
      const input = await $("#credit-card-amex");

      await input.typeKeys("111111111111111");
      let value = await input.getValue();

      expect(value).toBe("1111 111111 11111");
      await input.repeatKeys("Backspace", 15);
      value = await input.getValue();

      expect(value).toBe("");
    });

    it("can backspace in the middle", async () => {
      const input = await $("#credit-card-amex");

      await input.typeKeys("123456789012345");
      let value = await input.getValue();

      expect(value).toBe("1234 567890 12345");

      await input.repeatKeys("ArrowLeft", 10);
      value = await input.getValue();

      await browser.keys("Backspace");
      value = await input.getValue();

      expect(value).toBe("1234 578901 2345");
    });

    it("can delete after a gap", async () => {
      let selection;
      const input = await $("#credit-card-amex");

      await input.typeKeys("123456");
      let value = await input.getValue();

      expect(value).toBe("1234 56");
      await browser.keys("ArrowLeft");
      await browser.keys("ArrowLeft");

      selection = await input.getSelectionRange();
      expect(selection.start).toBe(5);
      expect(selection.end).toBe(5);

      await browser.keys("Delete");
      value = await input.getValue();

      expect(value).toBe("1234 6");

      selection = await input.getSelectionRange();
      expect(selection.start).toBe(5);
      expect(selection.end).toBe(5);
    });

    it("can delete before a gap", async () => {
      let selection;
      const input = await $("#credit-card-amex");

      await input.typeKeys("12345");
      let value = await input.getValue();

      expect(value).toBe("1234 5");

      await browser.keys("ArrowLeft");
      await browser.keys("ArrowLeft");

      selection = await input.getSelectionRange();
      expect(selection.start).toBe(4);
      expect(selection.end).toBe(4);

      await browser.keys("Delete");
      value = await input.getValue();

      expect(value).toBe("1234 ");

      selection = await input.getSelectionRange();
      expect(selection.start).toBe(5);
      expect(selection.end).toBe(5);
    });

    it("can prepend the first four digits", async () => {
      const input = await $("#credit-card-amex");
      let selection;

      await input.typeKeys("412345678");
      let value = await input.getValue();

      expect(value).toBe("4123 45678");

      selection = await input.getSelectionRange();
      expect(selection.start).toBe(10);
      expect(selection.end).toBe(10);

      value = await input.getValue();
      await input.repeatKeys("ArrowLeft", value.length);

      await input.typeKeys("0000");
      value = await input.getValue();

      expect(value).toBe("0000 412345 678");

      selection = await input.getSelectionRange();
      expect(selection.start).toBe(5);
      expect(selection.end).toBe(5);
    });

    it("does not overwrite when more digits can fit in the field", async () => {
      let selection;
      const input = await $("#credit-card-amex");

      await input.typeKeys("1234567");
      let value = await input.getValue();

      expect(value).toBe("1234 567");

      selection = await input.getSelectionRange();
      expect(selection.start).toBe(8);
      expect(selection.end).toBe(8);

      value = await input.getValue();
      await input.repeatKeys("ArrowLeft", value.length);
      await input.typeKeys("0000");

      value = await input.getValue();
      expect(value).toBe("0000 123456 7");

      selection = await input.getSelectionRange();
      expect(selection.start).toBe(5);
      expect(selection.end).toBe(5);
    });
  });

  describe("for unformatted", () => {
    it("enters a credit card", async () => {
      const input = $("#credit-card-unformatted");

      await input.typeKeys("4111111111111111");
      const value = await input.getValue();

      expect(value).toBe("4111111111111111");
    });

    it("only allows digits", async () => {
      const input = $("#credit-card-unformatted");

      await input.typeKeys(
        "a12bcdef3ghh4ij56klmn7opqr8stuv9wx0yz !123@#$4%^&*()_=+56"
      );
      const value = await input.getValue();

      expect(value).toBe("1234567890123456");
    });

    it("limits input size", async () => {
      const input = $("#credit-card-unformatted");

      await input.typeKeys("41111111111111111234567890123456");
      const value = await input.getValue();

      expect(value).toBe("4111111111111111");
    });

    it("field overwrites", async () => {
      const input = $("#credit-card-unformatted");

      await input.typeKeys("1111111111111111");
      let value = await input.getValue();

      expect(value).toBe("1111111111111111");

      await input.repeatKeys("ArrowLeft", 16);
      await input.typeKeys("2222222222222222");
      value = await input.getValue();

      expect(value).toBe("2222222222222222");
    });

    it("can backspace a whole field", async () => {
      const input = $("#credit-card-unformatted");

      await input.typeKeys("1111111111111111");
      let value = await input.getValue();

      expect(value).toBe("1111111111111111");

      await input.repeatKeys("Backspace", 16);
      value = await input.getValue();

      expect(value).toBe("");
    });

    it("can backspace in the middle", async () => {
      const input = $("#credit-card-unformatted");

      await input.typeKeys("1234567890123456");
      let value = await input.getValue();

      expect(value).toBe("1234567890123456");

      await input.repeatKeys("ArrowLeft", 9);
      await browser.keys("Backspace");
      value = await input.getValue();

      expect(value).toBe("123456890123456");
    });
  });

  describe("for toggle-able", () => {
    it("toggles", async () => {
      const input = $("#credit-card-toggle-able");
      const button = $("#credit-card-toggle-able-btn");

      await input.typeKeys("4111111111111111");
      let value = await input.getValue();

      expect(value).toBe("4111 1111 1111 1111");

      await button.click();
      value = await input.getValue();

      expect(value).toBe("4111 111111 11111");
    });
  });

  describe("wildcard", () => {
    it("accepts digits", async () => {
      const input = $("#wildcard");

      await input.typeKeys("3333");
      const value = await input.getValue();

      expect(value).toBe("*A*3 3");
    });

    it("accepts lowercase alpha", async () => {
      const input = $("#wildcard");

      await input.typeKeys("jjjj");
      const value = await input.getValue();

      expect(value).toBe("*A*3 jjj");
    });

    it("accepts uppercase alpha", async () => {
      const input = $("#wildcard");

      await input.typeKeys("NNNN");
      const value = await input.getValue();

      expect(value).toBe("*A*3 NNN");
    });

    it("accepts mixed alphanumeric", async () => {
      const input = $("#wildcard");

      await input.typeKeys("aZ54");
      const value = await input.getValue();

      expect(value).toBe("*A*3 aZ54");
    });
  });
});
