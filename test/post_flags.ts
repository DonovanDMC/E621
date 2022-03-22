/* eslint-disable @typescript-eslint/no-empty-function */
import { E6Client } from "./E6Client";
import { expect } from "chai";
import debug from "debug";
import "mocha";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const skipAuthRequired = true;
// debug.enable("e621:*");
describe("Post Flags", function() {
	it("get post flag by id", async function() {
		const postFlag = await E6Client.postFlags.get(449654);
		expect(postFlag).to.not.equal(null, "failed to get post flag");
	});

	it("search post flags without query", async function() {
		const search = await E6Client.postFlags.search();
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search post flags by post id", async function() {
		const search = await E6Client.postFlags.search({ post_id: 2726266 });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search post flags by resolved", async function() {
		const searchTrue = await E6Client.postFlags.search({ resolved: true });
		const searchFalse = await E6Client.postFlags.search({ resolved: false });
		expect(searchTrue.length, "resolved=true").length.to.not.equal(0, "true search returned zero results");
		expect(searchFalse.length, "resolved=false").length.to.not.equal(0, "false search returned zero results");
	});

	// @TODO Create Post Flag Test
	it.skip("create post set", async function() {});

	// @TODO Delete Post Flag Test
	it.skip("delete post set", async function() {});
});
