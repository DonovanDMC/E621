import { readFile, writeFile } from "node:fs/promises";
import { relative } from "node:path";
import { fileURLToPath } from "node:url";

import { globIterate } from "glob";

const root = fileURLToPath(new URL("../", import.meta.url));
const dir = `${root}/lib/generated`;

const REPLACEMENTS = {
    "BodyInit": "RequestInit['body']",
    "export type TagRequestStatuses = 'active' | 'deleted' | 'processing' | 'queued' | 'retired' | 'pending' | string": "export type TagRequestStatuses = 'active' | 'deleted' | 'processing' | 'queued' | 'retired' | 'pending' | `error: ${string}`",
};

const noMatches = new Set(Object.keys(REPLACEMENTS));
for await (const file of globIterate(`${dir}/**/*.ts`)) {
    const content = await readFile(file, "utf8");
    let newContent = content;
    for (const [find, replace] of Object.entries(REPLACEMENTS)) {
        if (newContent.includes(find)) {
            console.log(`Replacing "${find}" -> "${replace}" in ${relative(root, file)}`);
            noMatches.delete(find);
        }
        newContent = newContent.replaceAll(find, replace);
    }

    if (newContent !== content) {
        console.log(`Updating ${file}`);
        await writeFile(file, newContent);
    }
}

if (noMatches.size !== 0) {
    console.log(`No matches found for pattern${noMatches.size !== 1 ? "s" : ""}`);
    for (const name of noMatches) {
        console.log(`- "${name}"`);
    }
}
