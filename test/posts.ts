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
		const search = await E6Client.posts.searchHistory({ userID: 323290 });
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
		const search1 = await E6Client.posts.searchHistory({ ratingChangedTo: "e" });
		const search2 = await E6Client.posts.searchHistory({ ratingChangedTo: "q" });
		const search3 = await E6Client.posts.searchHistory({ ratingChangedTo: "s" });
		expect(search1.length, "ratingChangedTo=e").to.not.equal(0, "ratingChangedTo=e search returned zero results");
		expect(search2.length, "ratingChangedTo=q").to.not.equal(0, "ratingChangedTo=q search returned zero results");
		expect(search3.length, "ratingChangedTo=s").to.not.equal(0, "ratingChangedTo=s search returned zero results");
	});

	it("search post history with final rating", async function() {
		if (skipAuthRequired) this.skip();
		const search1 = await E6Client.posts.searchHistory({ finalRating: "e" });
		const search2 = await E6Client.posts.searchHistory({ finalRating: "q" });
		const search3 = await E6Client.posts.searchHistory({ finalRating: "s" });
		expect(search1.length, "finalRating=e").to.not.equal(0, "finalRating=e search returned zero results");
		expect(search2.length, "finalRating=q").to.not.equal(0, "finalRating=q search returned zero results");
		expect(search3.length, "finalRating=s").to.not.equal(0, "finalRating=s search returned zero results");
	});

	it("search post history with parent", async function() {
		if (skipAuthRequired) this.skip();
		const search = await E6Client.posts.searchHistory({ parent: 2936946 });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search post history with parent changed to", async function() {
		if (skipAuthRequired) this.skip();
		const search = await E6Client.posts.searchHistory({ parentChangedTo: 2936946 });
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
