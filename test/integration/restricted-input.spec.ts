import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";

declare global {
  interface Window {
    RestrictedInput: typeof import("../../src/main");
  }
}

const CARD = "{{9999}} {{9999}} {{9999}} {{9999}}";
const AMEX = "{{9999}} {{999999}} {{99999}}";

const inputs: Record<
  string,
  { pattern: string; type?: string; value?: string }
> = {
  "credit-card-number": { pattern: CARD },
  "prefilled-credit-card-number": {
    pattern: CARD,
    value: "4111111111111111",
  },
  "credit-card-amex": { pattern: AMEX },
  "credit-card-toggle-able": { pattern: CARD },
  "credit-card-unformatted": {
    pattern: "{{9999999999999999}}",
  },
  wildcard: { pattern: "*A*3 {{*A*3}}", type: "text" },
};

function mount(): void {
  document.body.innerHTML = "";

  for (const id of Object.keys(inputs)) {
    const config = inputs[id];
    const input = document.createElement("input");

    input.dataset.testid = id;
    input.type = config.type ?? "tel";
    if (config.value) {
      input.value = config.value;
    }
    document.body.appendChild(input);

    const restrictedInput = new window.RestrictedInput({
      element: input,
      pattern: config.pattern,
    });

    if (id === "credit-card-toggle-able") {
      const button = document.createElement("button");

      button.textContent = "Toggle";
      button.addEventListener("click", () => {
        restrictedInput.setPattern(AMEX);
      });
      document.body.appendChild(button);
    }
  }
}

describe("Restricted Input", () => {
  beforeAll(
    () =>
      new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");

        script.src = "/dist-app/restricted-input.js";
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error("Failed to load browser bundle"));
        document.head.appendChild(script);
      }),
  );

  beforeEach(mount);

  describe("for number", () => {
    test("enters a credit card", async () => {
      const input = page.getByTestId("credit-card-number");

      await userEvent.type(input, "4111111111111111");

      await expect.element(input).toHaveValue("4111 1111 1111 1111");
    });

    test("only allows digits", async () => {
      const input = page.getByTestId("credit-card-number");

      await userEvent.type(
        input,
        "a12bcdef3ghh4ij56klmn7opqr8stuv9wx0yz !123@#$4%^&*()_=+56",
      );

      await expect.element(input).toHaveValue("1234 5678 9012 3456");
    });

    test("limits input size", async () => {
      const input = page.getByTestId("credit-card-number");

      await userEvent.type(input, "41111111111111111234567890123456");

      await expect.element(input).toHaveValue("4111 1111 1111 1111");
    });

    test("should enter a space when expected gap", async () => {
      const input = page.getByTestId("credit-card-number");

      await userEvent.type(input, "4111");

      await expect.element(input).toHaveValue("4111 ");

      await userEvent.keyboard("1");

      await expect.element(input).toHaveValue("4111 1");
    });

    test("should keep the space when removing digit after gap", async () => {
      const input = page.getByTestId("credit-card-number");

      await userEvent.type(input, "41115");

      await expect.element(input).toHaveValue("4111 5");

      await userEvent.keyboard("{Backspace}");

      await expect.element(input).toHaveValue("4111 ");
    });

    test("backspacing after a gap should change the value", async () => {
      const input = page.getByTestId("credit-card-number");

      await userEvent.type(input, "41115");
      await userEvent.keyboard("{ArrowLeft}");
      await userEvent.keyboard("{Backspace}");

      await expect.element(input).toHaveValue("4115 ");
    });

    test("backspacing before a gap backspaces a character", async () => {
      const input = page.getByTestId("credit-card-number");

      await userEvent.type(input, "41115");

      await expect.element(input).toHaveValue("4111 5");

      await userEvent.keyboard("{ArrowLeft}".repeat(2));
      await userEvent.keyboard("{Backspace}");

      await expect.element(input).toHaveValue("4115 ");
    });

    test("backspacing the character after a gap should keep the cursor after the gap", async () => {
      const input = page.getByTestId("credit-card-number");

      await userEvent.type(input, "411156");

      await expect.element(input).toHaveValue("4111 56");

      await userEvent.keyboard("{ArrowLeft}");
      await userEvent.keyboard("{Backspace}");

      await expect.element(input).toHaveValue("4111 6");
      expect(input.element()).toHaveProperty("selectionStart", 5);
      expect(input.element()).toHaveProperty("selectionEnd", 5);
    });

    test("backspacing the character before a gap should backspace the character and move the gap", async () => {
      const input = page.getByTestId("credit-card-number");

      await userEvent.type(input, "411156");

      await expect.element(input).toHaveValue("4111 56");

      await userEvent.keyboard("{ArrowLeft}".repeat(3));
      await userEvent.keyboard("{Backspace}");

      await expect.element(input).toHaveValue("4115 6");
      expect(input.element()).toHaveProperty("selectionStart", 3);
      expect(input.element()).toHaveProperty("selectionEnd", 3);
    });

    test("field overwrites", async () => {
      const input = page.getByTestId("credit-card-number");

      await userEvent.type(input, "1111111111111111");

      await expect.element(input).toHaveValue("1111 1111 1111 1111");

      await userEvent.keyboard("{ArrowLeft}".repeat(19));
      await userEvent.keyboard("2222222222222222");

      await expect.element(input).toHaveValue("2222 2222 2222 2222");
    });

    test("can backspace a whole field", async () => {
      const input = page.getByTestId("credit-card-number");

      await userEvent.type(input, "1111111111111111");

      await expect.element(input).toHaveValue("1111 1111 1111 1111");

      await userEvent.keyboard("{Backspace}".repeat(16));

      await expect.element(input).toHaveValue("");
    });

    test("can backspace in the middle", async () => {
      const input = page.getByTestId("credit-card-number");

      await userEvent.type(input, "1234567890123456");

      await expect.element(input).toHaveValue("1234 5678 9012 3456");

      await userEvent.keyboard("{ArrowLeft}".repeat(11));
      await userEvent.keyboard("{Backspace}");

      await expect.element(input).toHaveValue("1234 5689 0123 456");
    });

    test("can delete after a gap", async () => {
      const input = page.getByTestId("credit-card-number");

      await userEvent.type(input, "123456");

      await expect.element(input).toHaveValue("1234 56");

      await userEvent.keyboard("{ArrowLeft}".repeat(2));

      expect(input.element()).toHaveProperty("selectionStart", 5);
      expect(input.element()).toHaveProperty("selectionEnd", 5);

      await userEvent.keyboard("{Delete}");

      await expect.element(input).toHaveValue("1234 6");
      expect(input.element()).toHaveProperty("selectionStart", 5);
      expect(input.element()).toHaveProperty("selectionEnd", 5);
    });

    test("can delete before a gap", async () => {
      const input = page.getByTestId("credit-card-number");

      await userEvent.type(input, "12345");

      await expect.element(input).toHaveValue("1234 5");

      await userEvent.keyboard("{ArrowLeft}".repeat(2));

      expect(input.element()).toHaveProperty("selectionStart", 4);
      expect(input.element()).toHaveProperty("selectionEnd", 4);

      await userEvent.keyboard("{Delete}");

      await expect.element(input).toHaveValue("1234 ");
      expect(input.element()).toHaveProperty("selectionStart", 5);
      expect(input.element()).toHaveProperty("selectionEnd", 5);
    });

    test("can prepend the first four digits", async () => {
      const input = page.getByTestId("credit-card-number");

      await userEvent.type(input, "412345678");

      await expect.element(input).toHaveValue("4123 4567 8");
      expect(input.element()).toHaveProperty("selectionStart", 11);
      expect(input.element()).toHaveProperty("selectionEnd", 11);

      await userEvent.keyboard("{ArrowLeft}".repeat(11));
      await userEvent.keyboard("0000");

      await expect.element(input).toHaveValue("0000 4123 4567 8");
      expect(input.element()).toHaveProperty("selectionStart", 5);
      expect(input.element()).toHaveProperty("selectionEnd", 5);
    });

    test("does not overwrite when more digits can fit in the field", async () => {
      const input = page.getByTestId("credit-card-number");

      await userEvent.type(input, "1234567");

      await expect.element(input).toHaveValue("1234 567");
      expect(input.element()).toHaveProperty("selectionStart", 8);
      expect(input.element()).toHaveProperty("selectionEnd", 8);

      await userEvent.keyboard("{ArrowLeft}".repeat(8));
      await userEvent.keyboard("0000");

      await expect.element(input).toHaveValue("0000 1234 567");
      expect(input.element()).toHaveProperty("selectionStart", 5);
      expect(input.element()).toHaveProperty("selectionEnd", 5);
    });

    test("pre-formats on initialization", async () => {
      const input = page.getByTestId("prefilled-credit-card-number");

      await expect.element(input).toHaveValue("4111 1111 1111 1111");
    });
  });

  describe("for amex", () => {
    test("enters a credit card", async () => {
      const input = page.getByTestId("credit-card-amex");

      await userEvent.type(input, "378211111111111");

      await expect.element(input).toHaveValue("3782 111111 11111");
    });

    test("only allows digits", async () => {
      const input = page.getByTestId("credit-card-amex");

      await userEvent.type(
        input,
        "a12bcdef3ghh4ij56klmn7opqr8stuv9wx0yz !123@#$4%^&*()_=+5",
      );

      await expect.element(input).toHaveValue("1234 567890 12345");
    });

    test("limits input size", async () => {
      const input = page.getByTestId("credit-card-amex");

      await userEvent.type(input, "3782111111111111234567890123456");

      await expect.element(input).toHaveValue("3782 111111 11111");
    });

    test("should enter a space for expected gap", async () => {
      const input = page.getByTestId("credit-card-amex");

      await userEvent.type(input, "3782");

      await expect.element(input).toHaveValue("3782 ");

      await userEvent.keyboard("1");

      await expect.element(input).toHaveValue("3782 1");
    });

    test("should keep the space when removing digit after gap", async () => {
      const input = page.getByTestId("credit-card-amex");

      await userEvent.type(input, "37825");

      await expect.element(input).toHaveValue("3782 5");

      await userEvent.keyboard("{Backspace}");

      await expect.element(input).toHaveValue("3782 ");
    });

    test("backspacing after a gap should change the value", async () => {
      const input = page.getByTestId("credit-card-amex");

      await userEvent.type(input, "37828");

      await expect.element(input).toHaveValue("3782 8");

      await userEvent.keyboard("{ArrowLeft}");
      await userEvent.keyboard("{Backspace}");

      await expect.element(input).toHaveValue("3788 ");
    });

    test("backspacing before a gap backspaces a character and fills the gap", async () => {
      const input = page.getByTestId("credit-card-amex");

      await userEvent.type(input, "37825");

      await expect.element(input).toHaveValue("3782 5");

      await userEvent.keyboard("{ArrowLeft}".repeat(2));
      await userEvent.keyboard("{Backspace}");

      await expect.element(input).toHaveValue("3785 ");
    });

    test("backspacing the character before a gap should backspace the character and move the gap", async () => {
      const input = page.getByTestId("credit-card-amex");

      await userEvent.type(input, "378256");

      await expect.element(input).toHaveValue("3782 56");

      await userEvent.keyboard("{ArrowLeft}".repeat(3));
      await userEvent.keyboard("{Backspace}");

      await expect.element(input).toHaveValue("3785 6");
      expect(input.element()).toHaveProperty("selectionStart", 3);
      expect(input.element()).toHaveProperty("selectionEnd", 3);
    });

    test("field overwrites", async () => {
      const input = page.getByTestId("credit-card-amex");

      await userEvent.type(input, "111111111111111");

      await expect.element(input).toHaveValue("1111 111111 11111");

      await userEvent.keyboard("{ArrowLeft}".repeat(17));
      await userEvent.keyboard("2222222222222222");

      await expect.element(input).toHaveValue("2222 222222 22222");
    });

    test("can backspace a whole field", async () => {
      const input = page.getByTestId("credit-card-amex");

      await userEvent.type(input, "111111111111111");

      await expect.element(input).toHaveValue("1111 111111 11111");

      await userEvent.keyboard("{Backspace}".repeat(15));

      await expect.element(input).toHaveValue("");
    });

    test("can backspace in the middle", async () => {
      const input = page.getByTestId("credit-card-amex");

      await userEvent.type(input, "123456789012345");

      await expect.element(input).toHaveValue("1234 567890 12345");

      await userEvent.keyboard("{ArrowLeft}".repeat(10));
      await userEvent.keyboard("{Backspace}");

      await expect.element(input).toHaveValue("1234 578901 2345");
    });

    test("can delete after a gap", async () => {
      const input = page.getByTestId("credit-card-amex");

      await userEvent.type(input, "123456");

      await expect.element(input).toHaveValue("1234 56");

      await userEvent.keyboard("{ArrowLeft}".repeat(2));

      expect(input.element()).toHaveProperty("selectionStart", 5);
      expect(input.element()).toHaveProperty("selectionEnd", 5);

      await userEvent.keyboard("{Delete}");

      await expect.element(input).toHaveValue("1234 6");
      expect(input.element()).toHaveProperty("selectionStart", 5);
      expect(input.element()).toHaveProperty("selectionEnd", 5);
    });

    test("can delete before a gap", async () => {
      const input = page.getByTestId("credit-card-amex");

      await userEvent.type(input, "12345");

      await expect.element(input).toHaveValue("1234 5");

      await userEvent.keyboard("{ArrowLeft}".repeat(2));

      expect(input.element()).toHaveProperty("selectionStart", 4);
      expect(input.element()).toHaveProperty("selectionEnd", 4);

      await userEvent.keyboard("{Delete}");

      await expect.element(input).toHaveValue("1234 ");
      expect(input.element()).toHaveProperty("selectionStart", 5);
      expect(input.element()).toHaveProperty("selectionEnd", 5);
    });

    test("can prepend the first four digits", async () => {
      const input = page.getByTestId("credit-card-amex");

      await userEvent.type(input, "412345678");

      await expect.element(input).toHaveValue("4123 45678");
      expect(input.element()).toHaveProperty("selectionStart", 10);
      expect(input.element()).toHaveProperty("selectionEnd", 10);

      await userEvent.keyboard("{ArrowLeft}".repeat(10));
      await userEvent.keyboard("0000");

      await expect.element(input).toHaveValue("0000 412345 678");
      expect(input.element()).toHaveProperty("selectionStart", 5);
      expect(input.element()).toHaveProperty("selectionEnd", 5);
    });

    test("does not overwrite when more digits can fit in the field", async () => {
      const input = page.getByTestId("credit-card-amex");

      await userEvent.type(input, "1234567");

      await expect.element(input).toHaveValue("1234 567");
      expect(input.element()).toHaveProperty("selectionStart", 8);
      expect(input.element()).toHaveProperty("selectionEnd", 8);

      await userEvent.keyboard("{ArrowLeft}".repeat(8));
      await userEvent.keyboard("0000");

      await expect.element(input).toHaveValue("0000 123456 7");
      expect(input.element()).toHaveProperty("selectionStart", 5);
      expect(input.element()).toHaveProperty("selectionEnd", 5);
    });
  });

  describe("for unformatted", () => {
    test("enters a credit card", async () => {
      const input = page.getByTestId("credit-card-unformatted");

      await userEvent.type(input, "4111111111111111");

      await expect.element(input).toHaveValue("4111111111111111");
    });

    test("only allows digits", async () => {
      const input = page.getByTestId("credit-card-unformatted");

      await userEvent.type(
        input,
        "a12bcdef3ghh4ij56klmn7opqr8stuv9wx0yz !123@#$4%^&*()_=+56",
      );

      await expect.element(input).toHaveValue("1234567890123456");
    });

    test("limits input size", async () => {
      const input = page.getByTestId("credit-card-unformatted");

      await userEvent.type(input, "41111111111111111234567890123456");

      await expect.element(input).toHaveValue("4111111111111111");
    });

    test("field overwrites", async () => {
      const input = page.getByTestId("credit-card-unformatted");

      await userEvent.type(input, "1111111111111111");

      await expect.element(input).toHaveValue("1111111111111111");

      await userEvent.keyboard("{ArrowLeft}".repeat(16));
      await userEvent.keyboard("2222222222222222");

      await expect.element(input).toHaveValue("2222222222222222");
    });

    test("can backspace a whole field", async () => {
      const input = page.getByTestId("credit-card-unformatted");

      await userEvent.type(input, "1111111111111111");

      await expect.element(input).toHaveValue("1111111111111111");

      await userEvent.keyboard("{Backspace}".repeat(16));

      await expect.element(input).toHaveValue("");
    });

    test("can backspace in the middle", async () => {
      const input = page.getByTestId("credit-card-unformatted");

      await userEvent.type(input, "1234567890123456");

      await expect.element(input).toHaveValue("1234567890123456");

      await userEvent.keyboard("{ArrowLeft}".repeat(9));
      await userEvent.keyboard("{Backspace}");

      await expect.element(input).toHaveValue("123456890123456");
    });
  });

  describe("for toggle-able", () => {
    test("toggles", async () => {
      const input = page.getByTestId("credit-card-toggle-able");

      await userEvent.type(input, "4111111111111111");

      await expect.element(input).toHaveValue("4111 1111 1111 1111");

      await page.getByRole("button", { name: "Toggle" }).click();

      await expect.element(input).toHaveValue("4111 111111 11111");
    });
  });

  describe("wildcard", () => {
    test("accepts digits", async () => {
      const input = page.getByTestId("wildcard");

      await userEvent.type(input, "3333");

      await expect.element(input).toHaveValue("*A*3 3");
    });

    test("accepts lowercase alpha", async () => {
      const input = page.getByTestId("wildcard");

      await userEvent.type(input, "jjjj");

      await expect.element(input).toHaveValue("*A*3 jjj");
    });

    test("accepts uppercase alpha", async () => {
      const input = page.getByTestId("wildcard");

      await userEvent.type(input, "NNNN");

      await expect.element(input).toHaveValue("*A*3 NNN");
    });

    test("accepts mixed alphanumeric", async () => {
      const input = page.getByTestId("wildcard");

      await userEvent.type(input, "aZ54");

      await expect.element(input).toHaveValue("*A*3 aZ54");
    });
  });
});
