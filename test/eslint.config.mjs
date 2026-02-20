import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig([{
    files: ["**/*.test.{ts,tsx}"],
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
}]);