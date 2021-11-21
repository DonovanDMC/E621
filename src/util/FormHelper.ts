export default class FormHelper {
	private parts: Array<string> = [];
	add(value: string): this;
	// eslint-disable-next-line @typescript-eslint/unified-signatures
	add(name: string, value: string | number | boolean): this;
	add(first: string, second?: string | number | boolean) {
		this.parts.push(!second ? encodeURIComponent(first) : `${first}=${encodeURIComponent(second)}`);
		return this;
	}

	build() { return this.parts.join("&"); }
	getRaw() { return Array.from(this.parts); }
	get2d() { return Array.from(this.parts).map(p => p.split("=")); }
	toString() { return this.build.call(this); }
}
