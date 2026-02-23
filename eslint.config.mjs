import { defineConfig, globalIgnores } from "eslint/config";
import braintreeClientConfig from "eslint-config-braintree/client";
import globals from "globals";

export default defineConfig([
  globalIgnores(["**/dist/", "**/dist-app/"]),
  ...braintreeClientConfig.default,
  {
    languageOptions: {
      globals: {
        define: true,
        ...globals.node,
      },
    },
  },
]);
