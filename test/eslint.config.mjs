import { defineConfig } from "eslint/config";
import braintreeClientConfig from "eslint-config-braintree/client";
import globals from "globals";

export default defineConfig([
  {
    files: ["**/*.test.{ts,tsx}"],
    ...braintreeClientConfig.default,
    languageOptions: {
      globals: {
        ...globals.mocha,
        ...globals.jest,
      },
    },

    rules: {
      "no-invalid-this": 0,
      "no-unused-expressions": 0,
    },
  },
]);
