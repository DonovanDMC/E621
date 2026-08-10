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
}, {
    files: ["lib/models/**/*"],
    rules: {
        // model filenames mirror their OpenAPI schema name exactly (e.g. `APIKey.ts`, `IQDBPost.ts`) - the
        // rule's pascalCase check treats runs of 2+ uppercase letters as one word and re-title-cases them
        // (`APIKey` -> `ApiKey`), which would fight that convention for any acronym-bearing schema name.
        "unicorn/filename-case": ["error", { cases: { pascalCase: true }, ignore: [/[A-Z]{2,}/] }]
    }
}]);
