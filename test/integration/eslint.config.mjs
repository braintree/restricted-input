import { defineConfig } from "eslint/config";
import braintreeClientConfig from "eslint-config-braintree/client";
import globals from "globals";

export default defineConfig([
  {
    ...braintreeClientConfig.default,
    languageOptions: {
      globals: {
        $: false,
        browser: false,
        ...globals.node,
      },
    },
  },
]);
