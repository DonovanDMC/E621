/* eslint-disable unicorn/filename-case */
import { defineConfig } from "@hey-api/openapi-ts";
import "dotenv/config";

const commit = "45c663c9b1a633c7f8f7c12d4620b0746b693d36";
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
        // `definitions.case: "preserve"` keeps generated *schema* type names exactly matching the spec's
        // schema names (e.g. `APIKey`, not the default PascalCase transform's `ApiKey`) - our model
        // files/classes are named to match those schema names 1:1, so a mismatch here would just
        // reintroduce the same drift by hand. This is deliberately scoped to `definitions` rather than
        // the top-level `case` - the latter also renames every operation Data/Response/Error type (e.g.
        // `AppealsClaimData` -> `appealsClaimData`), which would ripple through every module file.
        { name: "@hey-api/typescript", definitions: { case: "preserve" } },
        "@hey-api/sdk",
        "@hey-api/schemas",
        "@hey-api/client-fetch",
    ],
});
