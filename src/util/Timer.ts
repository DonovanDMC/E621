// https://github.com/UwUCode/Utils/blob/3e41d5bab0/src/Other/Timer.ts
export default class Timer {
	static now() { return process.hrtime.bigint(); }

	static calc(start: bigint, end: bigint, dec = 0) {
		const v = Number(end - start);
		return this.convert(parseFloat((v).toFixed(dec)), "ns", dec);
	}

	// https://github.com/UwUCode/Utils/blob/3e41d5bab0/src/Functions/Time.ts#L103-L119
	static convert(input: number, type: "ms" | "mi" | "ns", dec = 3): string {
		input = parseFloat(input.toFixed(dec));
		switch (type) {
			case "ms": return input < 1000 ? `${input}ms` : this.ms(input);
			case "mi": return input < 1000 ? `${input}µs` : this.convert(input / 1000, "ms", dec);
			case "ns": return input < 1000 ? `${input}ns` : this.convert(input / 1000, "mi", dec);
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			default: return `${input}${type}`;
		}
	}

	// https://github.com/UwUCode/Utils/blob/10b0159/src/Functions/Time.ts#L11-L86
	private static ms(time: number | bigint) {
		if (typeof time !== "bigint") time = BigInt(Math.floor(time));
		const r = {
			milliseconds: 0n,
			seconds:      0n,
			minutes:      0n,
			hours:        0n,
			days:         0n,
			months:       0n,
			years:        0n
		};
		if (time < 0n) throw new TypeError("Negative time provided.");
		if (time === 0n) return "0 seconds";
		// Number.EPSILON = https://stackoverflow.com/a/11832950
		r.milliseconds = time % 1000n;
		r.years = time / 31540000000n;
		time -= r.years * 31540000000n;
		r.months = time / 2628000000n;
		time -= r.months * 2628000000n;
		r.days = time / 86400000n;
		time -= r.days * 86400000n;
		r.hours = time / 3600000n;
		time -= r.hours * 3600000n;
		r.minutes = time / 60000n;
		time -= r.minutes * 60000n;
		r.seconds = time / 1000n;
		time -= r.seconds * 1000n;

		const total = (Object.values(r)).reduce((a, b) => a + b, 0n);
		if (r.milliseconds === total) return `${r.milliseconds}ms`;

		const str: Array<string> = [];
		if (r.seconds > 0) str.push(`${r.seconds} second${r.seconds === 1n ? "" : "s"}`);
		if (r.minutes > 0) str.push(`${r.minutes} minute${r.minutes === 1n ? "" : "s"}`);
		if (r.hours > 0) str.push(`${r.hours} hour${r.hours === 1n ? "" : "s"}`);
		if (r.days > 0) str.push(`${r.days} day${r.days === 1n ? "" : "s"}`);
		if (r.months > 0) str.push(`${r.months} month${r.months === 1n ? "" : "s"}`);
		if (r.years > 0) str.push(`${r.years} year${r.years === 1n ? "" : "s"}`);

		if (str.length > 1) str[0] = `and ${str[0]}`;

		return  str.reverse().join(" ");
	}
}
