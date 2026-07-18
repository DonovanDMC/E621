/* eslint-disable unicorn/filename-case */
import { defineConfig } from "@hey-api/openapi-ts";

const commit = "4a8898876f652a0d921e55a7a4b8a2cf9e43311b";
export default defineConfig({
    input: `https://raw.githubusercontent.com/DonovanDMC/E621OpenAPI/${commit}/openapi.yaml`,
    output: {
        path: "lib/generated",
        entryFile: false,
        importFileExtension: ".js",
        source: true,
        fileName: {
            suffix: null,
        },
    },
    plugins: [
        "@hey-api/typescript",
        "@hey-api/sdk",
        "@hey-api/schemas",
        "@hey-api/client-fetch",
    ],
});
