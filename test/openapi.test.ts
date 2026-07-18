import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { before, describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import source from "../lib/generated/source.json" with { type: "json" };

import type { OpenAPIV3 } from "openapi-types";

const libDir = fileURLToPath(new URL("../lib/", import.meta.url));

async function* walk(dir: string): AsyncGenerator<string> {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) {
            // the generated SDK itself isn't hand-written, so it can't have a typo'd @OperationID/@Schema
            if (entry.name === "generated") continue;
            yield* walk(path);
        } else if (entry.name.endsWith(".ts")) {
            yield path;
        }
    }
}

const operationIds = new Set(Object.values(source.paths).flatMap(path => (Object.values(path) as Array<OpenAPIV3.OperationObject>).map(operation => operation.operationId!)));
const schemaNames = new Set(Object.keys(source.components.schemas));

describe("OpenAPI spec references", () => {
    let invalidOperationIds: Array<string>;
    let invalidSchemas: Array<string>;

    before(async () => {
        invalidOperationIds = [];
        invalidSchemas = [];

        for await (const file of walk(libDir)) {
            const content = await readFile(file, "utf8");
            for (const match of content.matchAll(/@OperationID\("([^"]+)"\)/g)) {
                if (!operationIds.has(match[1])) invalidOperationIds.push(`${file}: "${match[1]}"`);
            }
            for (const match of content.matchAll(/@Schema\("([^"]+)"\)/g)) {
                if (!schemaNames.has(match[1])) invalidSchemas.push(`${file}: "${match[1]}"`);
            }
        }
    });

    it("every @OperationID(...) value used in lib/ exists in the OpenAPI spec", () => {
        assert.deepEqual(invalidOperationIds, [], `found OperationID value(s) not present in the spec:\n${invalidOperationIds.join("\n")}`);
    });

    it("every @Schema(...) value used in lib/ exists in the OpenAPI spec", () => {
        assert.deepEqual(invalidSchemas, [], `found Schema value(s) not present in the spec:\n${invalidSchemas.join("\n")}`);
    });

    it("sanity check: the spec actually has operation ids and schemas to compare against", () => {
        assert.ok(operationIds.size > 100, `expected many operation ids, got ${operationIds.size}`);
        assert.ok(schemaNames.size > 10, `expected many schemas, got ${schemaNames.size}`);
    });
});
