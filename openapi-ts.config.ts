/* eslint-disable unicorn/filename-case */
import { defineConfig } from "@hey-api/openapi-ts";

const commit = "3dab8bbbb07dd695412640321cd24559b8c4270a";
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
