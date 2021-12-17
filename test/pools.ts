/* eslint-disable @typescript-eslint/no-empty-function */
import { E6Client } from "./E6Client";
import { expect } from "chai";
import debug from "debug";
import "mocha";

const skipAuthRequired = true;
debug.enable("e621:*");
describe("Pools", function() {
	it("get pool by id", async function() {
		const pool = await E6Client.pools.get(11686);
		expect(pool).to.not.equal(null, "failed to get pool");
	});

	it("get pool by name", async function() {
		const pool = await E6Client.pools.getByName("Outside the Box (Tokifuji)");
		expect(pool).to.not.equal(null, "failed to get pool");
	});

	it("search pools without query", async function() {
		const search = await E6Client.pools.search();
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search pools by name", async function() {
		const search = await E6Client.pools.search({ name: "Outside the Box (Tokifuji)" });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search pools by description", async function() {
		const search = await E6Client.pools.search({ description: "https://foxes-in-love.tumblr.com" });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search pools by creator", async function() {
		const search = await E6Client.pools.search({ creator: "donovan_dmc" });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search pools by active", async function() {
		const searchTrue = await E6Client.pools.search({ active: true });
		const searchFalse = await E6Client.pools.search({ active: false });
		expect(searchTrue.length, "active=true").to.not.equal(0, "true search returned zero results");
		expect(searchFalse.length, "active=false").to.not.equal(0, "false search returned zero results");
	});

	it("search pools by category", async function() {
		const search1 = await E6Client.pools.search({ category: "collection" });
		const search2 = await E6Client.pools.search({ category: "series" });
		expect(search1.length, "category=collection").to.not.equal(0, "category=collection search returned zero results");
		expect(search2.length, "category=series").to.not.equal(0, "category=series search returned zero results");
	});

	it("search pools with order", async function() {
		const search1 = await E6Client.pools.search({ order: "updated_at" });
		const search2 = await E6Client.pools.search({ order: "name" });
		const search3 = await E6Client.pools.search({ order: "created_at" });
		const search4 = await E6Client.pools.search({ order: "post_count" });
		expect(search1.length, "order=updated_at").to.not.equal(0, "order=updated_at search returned zero results");
		expect(search2.length, "order=name").to.not.equal(0, "order=name search returned zero results");
		expect(search3.length, "order=created_at").to.not.equal(0, "order=created_at search returned zero results");
		expect(search4.length, "order=post_count").to.not.equal(0, "order=post_count search returned zero results");
	});

	// @TODO Create Pool Test
	it.skip("create pool", async function() {});

	// @TODO Modify Pool Test
	it.skip("modify pool", async function() {});

	// @TODO Delete Pool Test
	it.skip("delete pool", async function() {});

	// @TODO Revert Pool Test
	it.skip("revert pool", async function() {});

	it("search pool history without query", async function() {
		if (skipAuthRequired) this.skip();
		const search = await E6Client.pools.searchHistory();
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search pool history by pool id", async function() {
		if (skipAuthRequired) this.skip();
		const search = await E6Client.pools.searchHistory({ pool: 11686 });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	// @TODO Add Post To Pool Test
	it.skip("add post to pool", async function() {});

	// @TODO Remove Post From Pool Test
	it.skip("remove post from pool", async function() {});
});
