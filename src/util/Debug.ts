import debug from "debug";

export default function Debug(name: string, first: unknown, ...extra: Array<unknown>) {
	return debug(!name ? "e621:general" : `e621:${name}`)(first, ...extra);
}
