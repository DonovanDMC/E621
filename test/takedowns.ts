/* eslint-disable @typescript-eslint/no-empty-function */
import { E6Client } from "./E6Client";
import { expect } from "chai";
import debug from "debug";
import "mocha";

const skipAuthRequired = true;
// debug.enable("e621:*");
describe("Takedowns", function() {
	it.skip("get takedown by id", async function() {});

	it("search takedowns without query", async function() {
		const search = await E6Client.takedowns.search();
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search takedowns by status", async function() {
		const searchApproved = await E6Client.takedowns.search({ status: "approved" });
		const searchDenied = await E6Client.takedowns.search({ status: "denied" });
		const searchInactive = await E6Client.takedowns.search({ status: "inactive" });
		const searchPartial = await E6Client.takedowns.search({ status: "partial" });
		const searchPending = await E6Client.takedowns.search({ status: "pending" });
		expect(searchApproved.length, "status=approved").to.not.equal(0, "status=approved search returned zero results");
		expect(searchDenied.length, "status=denied").to.not.equal(0, "status=denied search returned zero results");
		expect(searchInactive.length, "status=inactive").to.not.equal(0, "status=inactive search returned zero results");
		expect(searchPartial.length, "status=partial").to.not.equal(0, "status=partial search returned zero results");
		expect(searchPending.length, "status=pending").to.not.equal(0, "status=pending search returned zero results");
	}).timeout(3e4);

	// @TODO Create Takedown Test
	it.skip("create takedown", async function() {});

	// @TODO Modify Takedown Test
	it.skip("modify takedown", async function() {});

	// @TODO Delete Takedown Test
	it.skip("delete takedown", async function() {});
});
