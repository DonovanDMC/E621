export default function Debug(name: string, first: unknown, ...extra: Array<unknown>) {
	// eslint-disable-next-line @typescript-eslint/consistent-type-imports
	let debug: import("debug").Debug;
	try {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		debug = require("debug");
	} catch {
		return;
	}
	return debug(!name ? "e621:general" : `e621:${name}`)(first, ...extra);
}
