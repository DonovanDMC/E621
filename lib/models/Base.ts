import { inspect, type InspectOptions } from "node:util";

import type E621 from "../index.js";
import type { NoV2Options, PostFormatOptions } from "../modules/posts/Format.js";

/** @category Models */
export default abstract class Base<D = unknown, PF extends PostFormatOptions = NoV2Options> {
    protected data!: D;
    protected e621!: E621<PF>;
    protected includeInInspect: Array<string> = [];
    constructor(e621: E621<PF>, data: D) {
        Object.defineProperties(this, {
            e621: { value: e621, enumerable: false },
            data: { value: data, enumerable: false },
        });
        Object.assign(this, data);
    }

    [inspect.custom](_depth: never, opts: InspectOptions): string {
        const klass = {
            [this.constructor.name]: class {
                constructor(data: D) {
                    Object.assign(this, data);
                }
            },
        };
        const data = structuredClone(this.data);
        if (this.includeInInspect.length !== 0) {
            for (const key of this.includeInInspect) {
                if (key in this) {
                    Object.defineProperty(data, key, {
                        value: (this as Record<string, unknown>)[key],
                        enumerable: true,
                    });
                }
            }
        }
        return inspect(new klass[this.constructor.name](data), opts);
    }

    toJSON(): D {
        return this.data;
    }
}
