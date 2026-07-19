/* eslint-disable unicorn/filename-case */
import { defineConfig } from "@hey-api/openapi-ts";
import "dotenv/config";

const commit = "01ea4202b45a13da92cde9666f2524405d245e0d";
// Set E621_OPENAPI_INPUT to a local openapi.yaml path (e.g. a sibling checkout of E621OpenAPI) to generate
// against it instead of fetching the pinned commit - useful for developing against unpushed spec changes.
const input = process.env.E621_OPENAPI_INPUT ?? `https://raw.githubusercontent.com/DonovanDMC/E621OpenAPI/${commit}/openapi.yaml`;

export default defineConfig({
    input,
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
