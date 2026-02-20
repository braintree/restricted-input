import { test, expect } from "@playwright/test";

test.describe("Restricted Input", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3099");
  });

  test.describe("for number", () => {
    test("enters a credit card", async ({ page }) => {
      const input = page.locator("#credit-card-number");

      await input.fill("");
      await input.pressSequentially("4111111111111111");
      const value = await input.inputValue();

      expect(value).toBe("4111 1111 1111 1111");
    });

    test("only allows digits", async ({ page }) => {
      const input = page.locator("#credit-card-number");

      await input.fill("");
      await input.pressSequentially(
        "a12bcdef3ghh4ij56klmn7opqr8stuv9wx0yz !123@#$4%^&*()_=+56",
      );
      const value = await input.inputValue();

      expect(value).toBe("1234 5678 9012 3456");
    });

    test("limits input size", async ({ page }) => {
      const input = page.locator("#credit-card-number");

      await input.fill("");
      await input.pressSequentially("41111111111111111234567890123456");
      const value = await input.inputValue();

      expect(value).toBe("4111 1111 1111 1111");
    });

    test("should enter a space when expected gap", async ({ page }) => {
      const input = page.locator("#credit-card-number");

      await input.fill("");
      await input.pressSequentially("4111");
      let value = await input.inputValue();

      expect(value).toBe("4111 ");

      await input.pressSequentially("1");
      value = await input.inputValue();

      expect(value).toBe("4111 1");
    });

    test("should keep the space when removing digit after gap", async ({
      page,
    }) => {
      const input = page.locator("#credit-card-number");

      await input.fill("");
      await input.pressSequentially("41115");
      let value = await input.inputValue();

      expect(value).toBe("4111 5");

      await page.keyboard.press("Backspace");
      value = await input.inputValue();

      expect(value).toBe("4111 ");
    });

    test("backspacing after a gap should change the value", async ({
      page,
    }) => {
      const input = page.locator("#credit-card-number");

      await input.fill("");
      await input.pressSequentially("41115");
      await page.keyboard.press("ArrowLeft");
      await page.keyboard.press("Backspace");
      const value = await input.inputValue();

      expect(value).toBe("4115 ");
    });

    test("backspacing before a gap backspaces a character", async ({
      page,
    }) => {
      const input = page.locator("#credit-card-number");

      await input.fill("");
      await input.pressSequentially("41115");
      let value = await input.inputValue();

      expect(value).toBe("4111 5");

      await page.keyboard.press("ArrowLeft");
      await page.keyboard.press("ArrowLeft");
      await page.keyboard.press("Backspace");
      value = await input.inputValue();

      expect(value).toBe("4115 ");
    });

    test("backspacing the character after a gap should keep the cursor after the gap", async ({
      page,
    }) => {
      const input = page.locator("#credit-card-number");

      await input.fill("");
      await input.pressSequentially("411156");
      let value = await input.inputValue();

      expect(value).toBe("4111 56");

      await page.keyboard.press("ArrowLeft");
      await page.keyboard.press("Backspace");
      value = await input.inputValue();

      expect(value).toBe("4111 6");

      const selection = await input.evaluate((el: HTMLInputElement) => ({
        start: el.selectionStart,
        end: el.selectionEnd,
      }));
      expect(selection.start).toBe(5);
      expect(selection.end).toBe(5);
    });

    test("backspacing the character before a gap should backspace the character and move the gap", async ({
      page,
    }) => {
      const input = page.locator("#credit-card-number");

      await input.fill("");
      await input.pressSequentially("411156");
      let value = await input.inputValue();

      expect(value).toBe("4111 56");

      await page.keyboard.press("ArrowLeft");
      await page.keyboard.press("ArrowLeft");
      await page.keyboard.press("ArrowLeft");
      await page.keyboard.press("Backspace");
      value = await input.inputValue();

      expect(value).toBe("4115 6");

      const selection = await input.evaluate((el: HTMLInputElement) => ({
        start: el.selectionStart,
        end: el.selectionEnd,
      }));
      expect(selection.start).toBe(3);
      expect(selection.end).toBe(3);
    });

    test("field overwrites", async ({ page }) => {
      const input = page.locator("#credit-card-number");

      await input.fill("");
      await input.pressSequentially("1111111111111111");
      let value = await input.inputValue();

      expect(value).toBe("1111 1111 1111 1111");

      for (let i = 0; i < 19; i++) {
        await page.keyboard.press("ArrowLeft");
      }
      await input.pressSequentially("2222222222222222");
      value = await input.inputValue();

      expect(value).toBe("2222 2222 2222 2222");
    });

    test("can backspace a whole field", async ({ page }) => {
      const input = page.locator("#credit-card-number");

      await input.fill("");
      await input.pressSequentially("1111111111111111");
      let value = await input.inputValue();

      expect(value).toBe("1111 1111 1111 1111");

      for (let i = 0; i < 16; i++) {
        await page.keyboard.press("Backspace");
      }
      value = await input.inputValue();

      expect(value).toBe("");
    });

    test("can backspace in the middle", async ({ page }) => {
      const input = page.locator("#credit-card-number");

      await input.fill("");
      await input.pressSequentially("1234567890123456");
      let value = await input.inputValue();

      expect(value).toBe("1234 5678 9012 3456");

      for (let i = 0; i < 11; i++) {
        await page.keyboard.press("ArrowLeft");
      }
      await page.keyboard.press("Backspace");
      value = await input.inputValue();

      expect(value).toBe("1234 5689 0123 456");
    });

    test("can delete after a gap", async ({ page }) => {
      const input = page.locator("#credit-card-number");

      await input.fill("");
      await input.pressSequentially("123456");
      let value = await input.inputValue();

      expect(value).toBe("1234 56");
      await page.keyboard.press("ArrowLeft");
      await page.keyboard.press("ArrowLeft");

      let selection = await input.evaluate((el: HTMLInputElement) => ({
        start: el.selectionStart,
        end: el.selectionEnd,
      }));
      expect(selection.start).toBe(5);
      expect(selection.end).toBe(5);

      await page.keyboard.press("Delete");
      value = await input.inputValue();

      expect(value).toBe("1234 6");

      selection = await input.evaluate((el: HTMLInputElement) => ({
        start: el.selectionStart,
        end: el.selectionEnd,
      }));
      expect(selection.start).toBe(5);
      expect(selection.end).toBe(5);
    });

    test("can delete before a gap", async ({ page }) => {
      const input = page.locator("#credit-card-number");

      await input.fill("");
      await input.pressSequentially("12345");
      let value = await input.inputValue();

      expect(value).toBe("1234 5");

      await page.keyboard.press("ArrowLeft");
      await page.keyboard.press("ArrowLeft");

      let selection = await input.evaluate((el: HTMLInputElement) => ({
        start: el.selectionStart,
        end: el.selectionEnd,
      }));
      expect(selection.start).toBe(4);
      expect(selection.end).toBe(4);

      await page.keyboard.press("Delete");
      value = await input.inputValue();
      expect(value).toBe("1234 ");

      selection = await input.evaluate((el: HTMLInputElement) => ({
        start: el.selectionStart,
        end: el.selectionEnd,
      }));
      expect(selection.start).toBe(5);
      expect(selection.end).toBe(5);
    });

    test("can prepend the first four digits", async ({ page }) => {
      const input = page.locator("#credit-card-number");

      await input.fill("");
      await input.pressSequentially("412345678");
      let value = await input.inputValue();

      expect(value).toBe("4123 4567 8");

      let selection = await input.evaluate((el: HTMLInputElement) => ({
        start: el.selectionStart,
        end: el.selectionEnd,
      }));
      expect(selection.start).toBe(11);
      expect(selection.end).toBe(11);

      value = await input.inputValue();
      for (let i = 0; i < value.length; i++) {
        await page.keyboard.press("ArrowLeft");
      }

      await input.pressSequentially("0000");
      value = await input.inputValue();

      expect(value).toBe("0000 4123 4567 8");

      selection = await input.evaluate((el: HTMLInputElement) => ({
        start: el.selectionStart,
        end: el.selectionEnd,
      }));
      expect(selection.start).toBe(5);
      expect(selection.end).toBe(5);
    });

    test("does not overwrite when more digits can fit in the field", async ({
      page,
    }) => {
      const input = page.locator("#credit-card-number");

      await input.fill("");
      await input.pressSequentially("1234567");
      let value = await input.inputValue();

      expect(value).toBe("1234 567");

      let selection = await input.evaluate((el: HTMLInputElement) => ({
        start: el.selectionStart,
        end: el.selectionEnd,
      }));
      expect(selection.start).toBe(8);
      expect(selection.end).toBe(8);

      value = await input.inputValue();
      for (let i = 0; i < value.length; i++) {
        await page.keyboard.press("ArrowLeft");
      }

      await input.pressSequentially("0000");
      value = await input.inputValue();

      expect(value).toBe("0000 1234 567");

      selection = await input.evaluate((el: HTMLInputElement) => ({
        start: el.selectionStart,
        end: el.selectionEnd,
      }));
      expect(selection.start).toBe(5);
      expect(selection.end).toBe(5);
    });

    test("pre-formats on initialization", async ({ page }) => {
      const input = page.locator("#prefilled-credit-card-number");
      const value = await input.inputValue();

      expect(value).toBe("4111 1111 1111 1111");
    });
  });

  test.describe("for amex", () => {
    test("enters a credit card", async ({ page }) => {
      const input = page.locator("#credit-card-amex");

      await input.fill("");
      await input.pressSequentially("378211111111111");
      const value = await input.inputValue();

      expect(value).toBe("3782 111111 11111");
    });

    test("only allows digits", async ({ page }) => {
      const input = page.locator("#credit-card-amex");

      await input.fill("");
      await input.pressSequentially(
        "a12bcdef3ghh4ij56klmn7opqr8stuv9wx0yz !123@#$4%^&*()_=+5",
      );
      const value = await input.inputValue();

      expect(value).toBe("1234 567890 12345");
    });

    test("limits input size", async ({ page }) => {
      const input = page.locator("#credit-card-amex");

      await input.fill("");
      await input.pressSequentially("3782111111111111234567890123456");
      const value = await input.inputValue();

      expect(value).toBe("3782 111111 11111");
    });

    test("should enter a space for expected gap", async ({ page }) => {
      const input = page.locator("#credit-card-amex");

      await input.fill("");
      await input.pressSequentially("3782");
      let value = await input.inputValue();

      expect(value).toBe("3782 ");

      await input.pressSequentially("1");
      value = await input.inputValue();

      expect(value).toBe("3782 1");
    });

    test("should keep the space when removing digit after gap", async ({
      page,
    }) => {
      const input = page.locator("#credit-card-amex");

      await input.fill("");
      await input.pressSequentially("37825");
      let value = await input.inputValue();

      expect(value).toBe("3782 5");

      await page.keyboard.press("Backspace");
      value = await input.inputValue();

      expect(value).toBe("3782 ");
    });

    test("backspacing after a gap should change the value", async ({
      page,
    }) => {
      const input = page.locator("#credit-card-amex");

      await input.fill("");
      await input.pressSequentially("37828");
      let value = await input.inputValue();

      expect(value).toBe("3782 8");

      await page.keyboard.press("ArrowLeft");
      await page.keyboard.press("Backspace");
      value = await input.inputValue();

      expect(value).toBe("3788 ");
    });

    test("backspacing before a gap backspaces a character and fills the gap", async ({
      page,
    }) => {
      const input = page.locator("#credit-card-amex");

      await input.fill("");
      await input.pressSequentially("37825");
      let value = await input.inputValue();

      expect(value).toBe("3782 5");

      await page.keyboard.press("ArrowLeft");
      await page.keyboard.press("ArrowLeft");
      await page.keyboard.press("Backspace");
      value = await input.inputValue();

      expect(value).toBe("3785 ");
    });

    test("backspacing the character before a gap should backspace the character and move the gap", async ({
      page,
    }) => {
      const input = page.locator("#credit-card-amex");

      await input.fill("");
      await input.pressSequentially("378256");
      let value = await input.inputValue();

      expect(value).toBe("3782 56");

      await page.keyboard.press("ArrowLeft");
      await page.keyboard.press("ArrowLeft");
      await page.keyboard.press("ArrowLeft");
      await page.keyboard.press("Backspace");
      value = await input.inputValue();

      expect(value).toBe("3785 6");

      const selection = await input.evaluate((el: HTMLInputElement) => ({
        start: el.selectionStart,
        end: el.selectionEnd,
      }));
      expect(selection.start).toBe(3);
      expect(selection.end).toBe(3);
    });

    test("field overwrites", async ({ page }) => {
      const input = page.locator("#credit-card-amex");

      await input.fill("");
      await input.pressSequentially("111111111111111");
      let value = await input.inputValue();

      expect(value).toBe("1111 111111 11111");

      for (let i = 0; i < 17; i++) {
        await page.keyboard.press("ArrowLeft");
      }
      await input.pressSequentially("2222222222222222");
      value = await input.inputValue();

      expect(value).toBe("2222 222222 22222");
    });

    test("can backspace a whole field", async ({ page }) => {
      const input = page.locator("#credit-card-amex");

      await input.fill("");
      await input.pressSequentially("111111111111111");
      let value = await input.inputValue();

      expect(value).toBe("1111 111111 11111");
      for (let i = 0; i < 15; i++) {
        await page.keyboard.press("Backspace");
      }
      value = await input.inputValue();

      expect(value).toBe("");
    });

    test("can backspace in the middle", async ({ page }) => {
      const input = page.locator("#credit-card-amex");

      await input.fill("");
      await input.pressSequentially("123456789012345");
      let value = await input.inputValue();

      expect(value).toBe("1234 567890 12345");

      for (let i = 0; i < 10; i++) {
        await page.keyboard.press("ArrowLeft");
      }

      await page.keyboard.press("Backspace");
      value = await input.inputValue();

      expect(value).toBe("1234 578901 2345");
    });

    test("can delete after a gap", async ({ page }) => {
      const input = page.locator("#credit-card-amex");

      await input.fill("");
      await input.pressSequentially("123456");
      let value = await input.inputValue();

      expect(value).toBe("1234 56");
      await page.keyboard.press("ArrowLeft");
      await page.keyboard.press("ArrowLeft");

      let selection = await input.evaluate((el: HTMLInputElement) => ({
        start: el.selectionStart,
        end: el.selectionEnd,
      }));
      expect(selection.start).toBe(5);
      expect(selection.end).toBe(5);

      await page.keyboard.press("Delete");
      value = await input.inputValue();

      expect(value).toBe("1234 6");

      selection = await input.evaluate((el: HTMLInputElement) => ({
        start: el.selectionStart,
        end: el.selectionEnd,
      }));
      expect(selection.start).toBe(5);
      expect(selection.end).toBe(5);
    });

    test("can delete before a gap", async ({ page }) => {
      const input = page.locator("#credit-card-amex");

      await input.fill("");
      await input.pressSequentially("12345");
      let value = await input.inputValue();

      expect(value).toBe("1234 5");

      await page.keyboard.press("ArrowLeft");
      await page.keyboard.press("ArrowLeft");

      let selection = await input.evaluate((el: HTMLInputElement) => ({
        start: el.selectionStart,
        end: el.selectionEnd,
      }));
      expect(selection.start).toBe(4);
      expect(selection.end).toBe(4);

      await page.keyboard.press("Delete");
      value = await input.inputValue();

      expect(value).toBe("1234 ");

      selection = await input.evaluate((el: HTMLInputElement) => ({
        start: el.selectionStart,
        end: el.selectionEnd,
      }));
      expect(selection.start).toBe(5);
      expect(selection.end).toBe(5);
    });

    test("can prepend the first four digits", async ({ page }) => {
      const input = page.locator("#credit-card-amex");

      await input.fill("");
      await input.pressSequentially("412345678");
      let value = await input.inputValue();

      expect(value).toBe("4123 45678");

      let selection = await input.evaluate((el: HTMLInputElement) => ({
        start: el.selectionStart,
        end: el.selectionEnd,
      }));
      expect(selection.start).toBe(10);
      expect(selection.end).toBe(10);

      value = await input.inputValue();
      for (let i = 0; i < value.length; i++) {
        await page.keyboard.press("ArrowLeft");
      }

      await input.pressSequentially("0000");
      value = await input.inputValue();

      expect(value).toBe("0000 412345 678");

      selection = await input.evaluate((el: HTMLInputElement) => ({
        start: el.selectionStart,
        end: el.selectionEnd,
      }));
      expect(selection.start).toBe(5);
      expect(selection.end).toBe(5);
    });

    test("does not overwrite when more digits can fit in the field", async ({
      page,
    }) => {
      const input = page.locator("#credit-card-amex");

      await input.fill("");
      await input.pressSequentially("1234567");
      let value = await input.inputValue();

      expect(value).toBe("1234 567");

      let selection = await input.evaluate((el: HTMLInputElement) => ({
        start: el.selectionStart,
        end: el.selectionEnd,
      }));
      expect(selection.start).toBe(8);
      expect(selection.end).toBe(8);

      value = await input.inputValue();
      for (let i = 0; i < value.length; i++) {
        await page.keyboard.press("ArrowLeft");
      }
      await input.pressSequentially("0000");

      value = await input.inputValue();
      expect(value).toBe("0000 123456 7");

      selection = await input.evaluate((el: HTMLInputElement) => ({
        start: el.selectionStart,
        end: el.selectionEnd,
      }));
      expect(selection.start).toBe(5);
      expect(selection.end).toBe(5);
    });
  });

  test.describe("for unformatted", () => {
    test("enters a credit card", async ({ page }) => {
      const input = page.locator("#credit-card-unformatted");

      await input.fill("");
      await input.pressSequentially("4111111111111111");
      const value = await input.inputValue();

      expect(value).toBe("4111111111111111");
    });

    test("only allows digits", async ({ page }) => {
      const input = page.locator("#credit-card-unformatted");

      await input.fill("");
      await input.pressSequentially(
        "a12bcdef3ghh4ij56klmn7opqr8stuv9wx0yz !123@#$4%^&*()_=+56",
      );
      const value = await input.inputValue();

      expect(value).toBe("1234567890123456");
    });

    test("limits input size", async ({ page }) => {
      const input = page.locator("#credit-card-unformatted");

      await input.fill("");
      await input.pressSequentially("41111111111111111234567890123456");
      const value = await input.inputValue();

      expect(value).toBe("4111111111111111");
    });

    test("field overwrites", async ({ page }) => {
      const input = page.locator("#credit-card-unformatted");

      await input.fill("");
      await input.pressSequentially("1111111111111111");
      let value = await input.inputValue();

      expect(value).toBe("1111111111111111");

      for (let i = 0; i < 16; i++) {
        await page.keyboard.press("ArrowLeft");
      }
      await input.pressSequentially("2222222222222222");
      value = await input.inputValue();

      expect(value).toBe("2222222222222222");
    });

    test("can backspace a whole field", async ({ page }) => {
      const input = page.locator("#credit-card-unformatted");

      await input.fill("");
      await input.pressSequentially("1111111111111111");
      let value = await input.inputValue();

      expect(value).toBe("1111111111111111");

      for (let i = 0; i < 16; i++) {
        await page.keyboard.press("Backspace");
      }
      value = await input.inputValue();

      expect(value).toBe("");
    });

    test("can backspace in the middle", async ({ page }) => {
      const input = page.locator("#credit-card-unformatted");

      await input.fill("");
      await input.pressSequentially("1234567890123456");
      let value = await input.inputValue();

      expect(value).toBe("1234567890123456");

      for (let i = 0; i < 9; i++) {
        await page.keyboard.press("ArrowLeft");
      }
      await page.keyboard.press("Backspace");
      value = await input.inputValue();

      expect(value).toBe("123456890123456");
    });
  });

  test.describe("for toggle-able", () => {
    test("toggles", async ({ page }) => {
      const input = page.locator("#credit-card-toggle-able");
      const button = page.locator("#credit-card-toggle-able-btn");

      await input.fill("");
      await input.pressSequentially("4111111111111111");
      let value = await input.inputValue();

      expect(value).toBe("4111 1111 1111 1111");

      await button.click();
      value = await input.inputValue();

      expect(value).toBe("4111 111111 11111");
    });
  });

  test.describe("wildcard", () => {
    test("accepts digits", async ({ page }) => {
      const input = page.locator("#wildcard");

      await input.fill("");
      await input.pressSequentially("3333");
      const value = await input.inputValue();

      expect(value).toBe("*A*3 3");
    });

    test("accepts lowercase alpha", async ({ page }) => {
      const input = page.locator("#wildcard");

      await input.fill("");
      await input.pressSequentially("jjjj");
      const value = await input.inputValue();

      expect(value).toBe("*A*3 jjj");
    });

    test("accepts uppercase alpha", async ({ page }) => {
      const input = page.locator("#wildcard");

      await input.fill("");
      await input.pressSequentially("NNNN");
      const value = await input.inputValue();

      expect(value).toBe("*A*3 NNN");
    });

    test("accepts mixed alphanumeric", async ({ page }) => {
      const input = page.locator("#wildcard");

      await input.fill("");
      await input.pressSequentially("aZ54");
      const value = await input.inputValue();

      expect(value).toBe("*A*3 aZ54");
    });
  });
});
