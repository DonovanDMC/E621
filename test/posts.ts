/* eslint-disable @typescript-eslint/no-empty-function */
import { E6Client } from "./E6Client";
import { expect } from "chai";
import debug from "debug";
import "mocha";

const skipAuthRequired = true;
// debug.enable("e621:*");
describe("Posts", function() {
	it("get post by id", async function() {
		const post = await E6Client.posts.get(2907536);
		expect(post).to.not.equal(null, "failed to get post");
	});

	it("get post by md5", async function() {
		const post = await E6Client.posts.getByMD5("539bbca5667b8a83eff9c5e4e889ac15");
		expect(post).to.not.equal(null, "failed to get post");
	});

	it("search posts without query", async function() {
		const search = await E6Client.posts.search();
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search posts with tags", async function() {
		const search = await E6Client.posts.search({ tags: ["donovan_dmc"] });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	// @TODO Create Post (file) Test
	it.skip("create post (file)", async function() {});

	// @TODO Create Post (url) test
	it.skip("create post (url)", async function() {});

	// @TODO Modify Post Test
	it.skip("modify post", async function() {});

	// @TODO Revert Post Test
	it.skip("revert post", async function() {});

	it("search post history without query", async function() {
		if (skipAuthRequired) this.skip();
		const search = await E6Client.posts.searchHistory();
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search post history with user", async function() {
		if (skipAuthRequired) this.skip();
		const search = await E6Client.posts.searchHistory({ user: "donovan_dmc" });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search post history with user id", async function() {
		if (skipAuthRequired) this.skip();
		const search = await E6Client.posts.searchHistory({ user_id: 323290 });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search post history with post id", async function() {
		if (skipAuthRequired) this.skip();
		const search = await E6Client.posts.searchHistory({ post: 2907536 });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search post history with reason", async function() {
		if (skipAuthRequired) this.skip();
		const search = await E6Client.posts.searchHistory({ reason: "explicit" });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search post history with description", async function() {
		if (skipAuthRequired) this.skip();
		const search = await E6Client.posts.searchHistory({ description: "I did the thing" });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search post history with rating changed to", async function() {
		if (skipAuthRequired) this.skip();
		const search1 = await E6Client.posts.searchHistory({ rating_changed_to: "e" });
		const search2 = await E6Client.posts.searchHistory({ rating_changed_to: "q" });
		const search3 = await E6Client.posts.searchHistory({ rating_changed_to: "s" });
		expect(search1.length, "rating_changed_to=e").to.not.equal(0, "rating_changed_to=e search returned zero results");
		expect(search2.length, "rating_changed_to=q").to.not.equal(0, "rating_changed_to=q search returned zero results");
		expect(search3.length, "rating_changed_to=s").to.not.equal(0, "rating_changed_to=s search returned zero results");
	});

	it("search post history with final rating", async function() {
		if (skipAuthRequired) this.skip();
		const search1 = await E6Client.posts.searchHistory({ final_rating: "e" });
		const search2 = await E6Client.posts.searchHistory({ final_rating: "q" });
		const search3 = await E6Client.posts.searchHistory({ final_rating: "s" });
		expect(search1.length, "final_rating=e").to.not.equal(0, "final_rating=e search returned zero results");
		expect(search2.length, "final_rating=q").to.not.equal(0, "final_rating=q search returned zero results");
		expect(search3.length, "final_rating=s").to.not.equal(0, "final_rating=s search returned zero results");
	});

	it("search post history with parent", async function() {
		if (skipAuthRequired) this.skip();
		const search = await E6Client.posts.searchHistory({ parent: 2936946 });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search post history with parent changed to", async function() {
		if (skipAuthRequired) this.skip();
		const search = await E6Client.posts.searchHistory({ parent_changed_to: 2936946 });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	// seems to not do anything, even via e621's interface
	it.skip("search post history with source", async function() {
		if (skipAuthRequired) this.skip();
	});

	// @TODO Post Vote Up Test
	it.skip("post vote up", async function() {});

	// @TODO Post Vote Down Test
	it.skip("post vote down", async function() {});
});
