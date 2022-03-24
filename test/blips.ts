/* eslint-disable @typescript-eslint/no-empty-function */
import { E6Client, E6ClientLocalWithAuth } from "./E6Client";
import { expect } from "chai";
import debug from "debug";
import "mocha";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const skipAuthRequired = true;
// debug.enable("e621:*");
describe("Blips", function() {
	it("get blip by id", async function() {
		const blip = await E6Client.blips.get(1);
		expect(blip).to.not.equal(null, "failed to get blip");
	});

	it("search blips without query", async function() {
		const search = await E6Client.blips.search();
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search blips by response to", async function() {
		const search = await E6Client.blips.search({ response_to: 1 });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search blips by body", async function() {
		const search = await E6Client.blips.search({ body: "You got blipped" });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	// @TODO Create Blip Test
	it.skip("create blip", async function() {});

	// @TODO Modify Blip Test
	it.skip("modify blip", async function() {});

	// @TODO Modify Old Blip Test (should throw APIError)
	it.skip("modify old blip", async function() {
	});

	// @TODO Delete Blip Test
	it.skip("delete blip", async function() {});

	// @TODO Add Warning To Blip Test
	it.skip("add warning to blip", async function() {});
});
