import { readFile, writeFile } from "node:fs/promises";
const file = new URL("../lib/generated/client/client.ts", import.meta.url);

await writeFile(file, (await readFile(file, "utf8")).replaceAll("BodyInit", "RequestInit['body']"));
