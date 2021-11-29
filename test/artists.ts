import { expect } from "chai";
import { E6Client } from "./E6Client";
import "mocha";

const skipAuthRequired = true;
describe("Artists", function() {
	it("get artist by id", async function() {
		const artist = await E6Client.artists.get(6698);
		expect(artist).to.not.equal(null, "failed to get artist");
	});

	it("get artist by name", async function() {
		const artist = await E6Client.artists.getByName("vallhund");
		expect(artist).to.not.equal(null, "failed to get artist");
	});

	it("search artists without query", async function() {
		const search = await E6Client.artists.search();
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search artists by name", async function() {
		const search = await E6Client.artists.search({ name: "vallhund" });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search artists by url", async function() {
		const search = await E6Client.artists.search({ url: "twitter.com/vallhound" });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search artists by creator", async function() {
		const search = await E6Client.artists.search({ creator: "administrator" });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search artists by active", async function() {
		const searchTrue = await E6Client.artists.search({ active: true });
		const searchFalse = await E6Client.artists.search({ active: false });
		expect(searchTrue.length, "active=true").to.not.equal(0, "true search returned zero results");
		expect(searchFalse.length, "active=false").to.not.equal(0, "false search returned zero results");
	});

	it("search artists by banned", async function() {
		const searchTrue = await E6Client.artists.search({ banned: true });
		const searchFalse = await E6Client.artists.search({ banned: false });
		expect(searchTrue.length, "banned=true").length.to.not.equal(0, "true search returned zero results");
		expect(searchFalse.length, "banned=false").length.to.not.equal(0, "false search returned zero results");
	});

	it("search artists by has_tag", async function() {
		const searchTrue = await E6Client.artists.search({ has_tag: true });
		const searchFalse = await E6Client.artists.search({ has_tag: false });
		expect(searchTrue.length, "has_tag=true").length.to.not.equal(0, "true search returned zero results");
		expect(searchFalse.length, "has_tag=false").length.to.not.equal(0, "false search returned zero results");
	});

	it("search artists with order", async function() {
		const search1 = await E6Client.artists.search({ order: "created_at" });
		const search2 = await E6Client.artists.search({ order: "updated_at" });
		const search3 = await E6Client.artists.search({ order: "name" });
		const search4 = await E6Client.artists.search({ order: "post_count" });
		expect(search1.length, "order=created_at").to.not.equal(0, "order=created_at search returned zero results");
		expect(search2.length, "order=updated_at").to.not.equal(0, "order=updated_at search returned zero results");
		expect(search3.length, "order=name").to.not.equal(0, "order=name search returned zero results");
		expect(search4.length, "order=post_count").to.not.equal(0, "order=post_count search returned zero results");
	});

	// @TODO Create Artist Test
	it.skip("create artist", async function() {});

	// @TODO Modify Artist Test
	it.skip("modify artist", async function() {});
	
	// @TODO Delete Artist Test
	it.skip("delete artist", async function() {});

	// @TODO Revert Artist Test
	it.skip("revert artist", async function() {});

	it("search artist history without query", async function() {
		if(skipAuthRequired) this.skip();
		const search = await E6Client.artists.searchHistory();
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search artist history by artist id", async function() {
		if(skipAuthRequired) this.skip();
		const search = await E6Client.artists.searchHistory({ artistID: 6698 });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search artist history by artist name", async function() {
		if(skipAuthRequired) this.skip();
		const search = await E6Client.artists.searchHistory({ artistName: "vallhund" });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search artist history by updater id", async function() {
		if(skipAuthRequired) this.skip();
		const search = await E6Client.artists.searchHistory({ updaterID: 1 });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search artist history by updater name", async function() {
		if(skipAuthRequired) this.skip();
		const search = await E6Client.artists.searchHistory({ updaterName: "administrator" });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});
});
