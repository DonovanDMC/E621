import config from "@uwu-codes/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig([config, {
    ignores: [
        "lib/generated/**/*",
    ],
}, {
    files: ["scripts/**/*"],
    rules: {
        "unicorn/filename-case": "off"
    }
}, {
    files: ["test/**/*"],
    rules: {
        // node:test's describe/it/before/after return values aren't meant to be awaited by the caller -
        // the test runner itself drives them.
        "@typescript-eslint/no-floating-promises": "off"
    }
}]);
