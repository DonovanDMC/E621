import E621 from "../build/src";
import pkg from "../package.json";

export const E6Client = new E621({
	userAgent: `E621Tests/${pkg.version} (https://github.com/DonovanDMC/E621; "donovan_dmc")`
});

export const E6ClientLocal = new E621.Dev({
	userAgent: `E621Tests/${pkg.version} (https://github.com/DonovanDMC/E621; "donovan_dmc")`
});

export const E6ClientLocalWithAuth = new E621.Dev({
	userAgent: `E621Tests/${pkg.version} (https://github.com/DonovanDMC/E621; "donovan_dmc")`,
	authUser:  "admin",
	authKey:   ""
});
