/* eslint-disable unicorn/filename-case */
import { defineConfig } from "@hey-api/openapi-ts";

const commit = "eb9ee1498a967465afe0b0bfdd84aa98051d320c";
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
