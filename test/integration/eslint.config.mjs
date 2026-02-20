import { defineConfig } from "eslint/config";

export default defineConfig([{
    languageOptions: {
        globals: {
            $: false,
            browser: false,
        },
    },
}]);