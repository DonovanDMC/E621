import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
    // input:  "https://raw.githubusercontent.com/DonovanDMC/E621OpenAPI/60347cfbfa465bbbce2e348b3132b5cbb0b0df20/openapi.yaml",
    input:  "https://e621.wiki/openapi.yaml",
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
