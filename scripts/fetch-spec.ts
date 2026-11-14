import { readFile, writeFile } from "node:fs/promises";

import "dotenv/config";
import { fetchSpec, specCommit } from "e621-openapi/spec";
import { parse } from "yaml";

// replace-openapi.ts and test/openapi.test.ts need the raw spec (descriptions, tags, security), which e621-openapi doesn't bundle.
// Set E621_OPENAPI_INPUT to a local openapi.yaml path (e.g. a sibling checkout of E621OpenAPI) to use it instead.
const output = new URL("../openapi.json", import.meta.url);

async function getSpec(): Promise<string> {
    if (process.env.E621_OPENAPI_INPUT) {
        return readFile(process.env.E621_OPENAPI_INPUT, "utf8");
    }

    const spec = await fetchSpec();
    console.log(`Fetched spec at ${specCommit}`);
    return spec;
}

await writeFile(output, `${JSON.stringify(parse(await getSpec()), null, 2)}\n`, "utf8");
