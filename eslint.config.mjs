import { defineConfig, globalIgnores } from "eslint/config";
import braintreeClientConfig from "eslint-config-braintree/client";

export default defineConfig([
  globalIgnores(["**/dist/", "**/dist-app/"]),
  ...braintreeClientConfig,
  {
    languageOptions: {
      globals: {
        define: true,
      },
    },
  },
]);
