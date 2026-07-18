import {
    cp,
    opendir,
    readFile,
    rm,
    writeFile,
} from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { type OpenAPIV3 } from "openapi-types";

import source from "../lib/generated/source.json" with { type: "json" };
import pkg from "../package.json" with { type: "json" };

async function* walk(dir: string): AsyncGenerator<string> {
    for await (const d of await opendir(dir)) {
        const entry = join(dir, d.name);
        if (d.isDirectory()) {
            yield* walk(entry);
        } else if (d.isFile()) {
            yield entry;
        }
    }
}

const operationMap = new Map<string, OpenAPIV3.OperationObject>(Object.values(source.paths).flatMap(path => (Object.values(path) as Array<OpenAPIV3.OperationObject>).map(operation => [operation.operationId!, operation])));
const schemas = new Map<string, OpenAPIV3.SchemaObject>(Object.entries(source.components.schemas as Record<string, OpenAPIV3.SchemaObject>));

const libDir = new URL("../lib", import.meta.url);
const buildDir = new URL("../build", import.meta.url);
await rm(buildDir, { recursive: true, force: true });
await cp(libDir, buildDir, { recursive: true });

await writeFile(join(fileURLToPath(buildDir), "version.ts"), `/** @category Constants */\nexport const VERSION = "${pkg.version}";\n`, "utf8");

for await (const file of walk(buildDir.pathname)) {
    const content = await readFile(file, "utf8");
    const lines = content.split("\n");
    const removeLines: Array<[number, number]> = [];
    let newContent = content.replaceAll(/@OperationID\("([^"]+)"\)/g, (match, operationId) => {
        const index = lines.findIndex(line => line.includes(match));
        let existingComment: string | undefined;
        if (lines.at(index - 1)?.trim().endsWith("*/")) {
            let startLine = 0;
            for (let i = index - 1; i >= 0; i--) {
                if (lines[i].trim().startsWith("/**")) {
                    startLine = i;
                    break;
                }
            }
            const comment = lines.slice(startLine, index).join("\n");
            existingComment = comment.split("\n").map(line => line.replace(/^\s*\*\s?/, "")).join("\n").trim().slice(3, -2).trim();
            removeLines.push([startLine, index]);
        }

        const operation = operationMap.get(operationId as string);
        if (!operation) {
            console.warn(`Operation ID ${operationId} not found in OpenAPI spec.`);
            return match;
        }
        const authTags: Array<string> = [];
        if (operation.security) {
            const types = new Set(operation.security.flatMap(s => Object.keys(s)).filter((v, i, a) => a.indexOf(v) === i));
            if (types.has("basicAuth")) authTags.push("@requiresApiKeyAuth");
            if (types.has("browserAuth")) authTags.push("@requiresCookieAuth");
            if (types.has("csrfToken")) authTags.push("@requiresCsrfToken");
        }

        const url = `https://e621.wiki/#operations-${operation.tags?.length ? `${operation.tags[0].replaceAll(" ", "_")}-` : ""}${operation.operationId}`;
        return [
            "/**",
            " *",
            ...(operation.description ? [` * ${operation.description}`,
                " *"] : []),
            ...(existingComment ? [` * ${existingComment}`,
                " *"] : []),
            ...(authTags.length === 0 ? [] : authTags.map(tag => ` * ${tag}`).concat(" *")),
            ` * @operationId {@link ${url} ${operation.operationId}}`,
            " *",
            ` * @see {@link ${url} Documentation} for more details.`,
            " */",
            `@OperationID("${operation.operationId}")`,
        ].map((v, i) => i === 0 ? v : `\t${v}`).join("\n");
    });
    newContent = newContent.replaceAll(/@Schema\("([^"]+)"\)/g, (match, schemaId) => {
        const index = lines.findIndex(line => line.includes(match));
        let existingComment: string | undefined;
        if (lines.at(index - 1)?.trim().endsWith("*/")) {
            let startLine = 0;
            for (let i = index - 1; i >= 0; i--) {
                if (lines[i].trim().startsWith("/**")) {
                    startLine = i;
                    break;
                }
            }
            const comment = lines.slice(startLine, index).join("\n");
            existingComment = comment.split("\n").map(line => line.replace(/^\s*\*\s?/, "")).join("\n").trim().slice(3, -2).trim();
            removeLines.push([startLine, index]);
        }

        const schema = schemas.get(schemaId as string);
        if (!schema) {
            console.warn(`Schema ID ${schemaId} not found in OpenAPI spec.`);
            return match;
        }

        const url = `https://e621.wiki/#model-${schemaId}`;
        return [
            "/**",
            ...(schema.description ? [` * ${schema.description}`,
                " *"] : []),
            ...(existingComment ? [` * ${existingComment}`,
                " *"] : []),
            ` * @schema {@link ${url} ${schemaId}}`,
            " *",
            ` * @see {@link ${url} Documentation} for more details.`,
            " */",
            `@Schema("${schemaId}")`,
        ].join("\n");
    });
    const newLines = newContent.split("\n");
    for (const [start, end] of removeLines.sort((a, b) => b[0] - a[0])) {
        newLines.splice(start, end - start);
    }
    newContent = newLines.join("\n");
    if (newContent !== content) {
        await writeFile(file, newContent, "utf8");
    }
}
