/* eslint-disable @typescript-eslint/no-empty-function */
import { E6Client } from "./E6Client";
import { expect } from "chai";
import debug from "debug";
import "mocha";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const skipAuthRequired = true;
debug.enable("e621:*");
describe("Tags", function() {
	it("get tag by id", async function() {
		const tag = await E6Client.tags.get(159510);
		expect(tag).to.not.equal(null, "failed to get post set");
	});

	it("get tag by name", async function() {
		const tag = await E6Client.tags.getByName("backsack");
		expect(tag).to.not.equal(null, "failed to get post set");
	});

	it("search tags without query", async function() {
		const search = await E6Client.postSets.search();
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search tags by name", async function() {
		const search = await E6Client.postSets.search({ name: "Paw Beans" });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	// there's anywhere between 0 and infinity tag categories with ids that change, no test can cover that

	it("search tags by hide empty", async function() {
		const searchTrue = await E6Client.tags.search({ hideEmpty: true });
		const searchFalse = await E6Client.tags.search({ hideEmpty: false });
		expect(searchTrue.length, "hideEmpty=true").to.not.equal(0, "true search returned zero results");
		expect(searchFalse.length, "hideEmpty=false").to.not.equal(0, "false search returned zero results");
	});

	it("search tags by has wiki", async function() {
		const searchTrue = await E6Client.tags.search({ hasWiki: true });
		const searchFalse = await E6Client.tags.search({ hasWiki: false });
		expect(searchTrue.length, "hasWiki=true").to.not.equal(0, "true search returned zero results");
		expect(searchFalse.length, "hasWiki=false").to.not.equal(0, "false search returned zero results");
	});

	it("search tags by has artist", async function() {
		const searchTrue = await E6Client.tags.search({ hasArtist: true });
		const searchFalse = await E6Client.tags.search({ hasArtist: false });
		expect(searchTrue.length, "hasArtist=true").to.not.equal(0, "true search returned zero results");
		expect(searchFalse.length, "hasArtist=false").to.not.equal(0, "false search returned zero results");
	});

	it("search tags with order", async function() {
		const search1 = await E6Client.tags.search({ order: "date" });
		const search2 = await E6Client.tags.search({ order: "count" });
		const search3 = await E6Client.tags.search({ order: "name" });
		expect(search1.length, "order=date").to.not.equal(0, "order=date search returned zero results");
		expect(search2.length, "order=count").to.not.equal(0, "order=count search returned zero results");
		expect(search3.length, "order=name").to.not.equal(0, "order=name search returned zero results");
	});

	// @TODO Modify Tag Test
	it.skip("modify tag", async function() {});

	it("search tag history without query", async function() {
		const search = await E6Client.tags.searchHistory();
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search tag history by tag", async function() {
		const search = await E6Client.tags.searchHistory({ tag: "donovan_dmc" });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search tag history by updater name", async function() {
		const search = await E6Client.tags.searchHistory({ userName: "millcore" });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search tag history by updater id", async function() {
		const search = await E6Client.tags.searchHistory({ userID: 169756 });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});
});
