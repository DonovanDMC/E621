import type E621 from "../index.js";

/**
 * Browser build of {@link Base}. `node:util`'s `inspect` is Node-only and pulling it in breaks browser
 * bundlers (see #15), so this variant drops the custom inspect implementation and is swapped in via
 * package.json's `browser` field.
 *
 * @category Models
 */
export default abstract class Base<D = unknown> {
    protected data!: D;
    protected e621!: E621;
    constructor(e621: E621, data: D) {
        Object.defineProperties(this, {
            e621: { value: e621, enumerable: false },
            data: { value: data, enumerable: false },
        });
        Object.assign(this, data);
    }

    toJSON(): D {
        return this.data;
    }
}
