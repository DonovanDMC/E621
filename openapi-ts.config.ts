import { defineConfig } from "@hey-api/openapi-ts";

const commit = "83cb9a03ccbf2348bb5d1392d7133ebbb573f0e6";
export default defineConfig({
    input:  `https://raw.githubusercontent.com/DonovanDMC/E621OpenAPI/${commit}/openapi.yaml`,
    output: {
        path:                "lib/generated",
        entryFile:           false,
        importFileExtension: ".js",
        source:              true,
        fileName:            {
            suffix: null
        }
    },
    plugins: [
        "@hey-api/typescript",
        "@hey-api/sdk",
        "@hey-api/schemas",
        "@hey-api/client-fetch"
    ]
});
