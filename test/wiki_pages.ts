/* eslint-disable @typescript-eslint/no-empty-function */
import { E6Client } from "./E6Client";
import { expect } from "chai";
import debug from "debug";
import "mocha";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const skipAuthRequired = true;
debug.enable("e621:*");
describe("Wiki Pages", function() {
	it("get wiki page by id", async function() {
		const wikiPage = await E6Client.wikiPages.get(35009);
		expect(wikiPage).to.not.equal(null, "failed to get wiki page");
	});

	it("get wiki page by name", async function() {
		const wikiPage = await E6Client.wikiPages.getByTitle("867-5309/jenny");
		expect(wikiPage).to.not.equal(null, "failed to get wiki page");
	});

	it("search wiki pages without query", async function() {
		const search = await E6Client.wikiPages.search();
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search wiki pages with title", async function() {
		const search = await E6Client.wikiPages.search({ title: "867-5309/jenny" });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search wiki pages with creator", async function() {
		const search = await E6Client.wikiPages.search({ creator: "donovan_dmc" });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search wiki pages with body", async function() {
		const search = await E6Client.wikiPages.search({ body: "A reference to the music video \"867-5309/Jenny\":https://www.youtube.com/watch?v=6WTdTwcmxyo by Tommy Tutone, where Jenny's phone number, 867-5309 is said repeatedly." });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	// @TODO Search Wiki Pages With Other Names Test
	it.skip("search wiki pages with other names", async function() {});

	it("search wiki pages with has other names", async function() {
		const searchTrue = await E6Client.wikiPages.search({ hasOtherNames: true });
		const searchFalse = await E6Client.wikiPages.search({ hasOtherNames: false  });
		expect(searchTrue.length, "hasOtherNames=true").to.not.equal(0, "true search returned zero results");
		expect(searchFalse.length, "hasOtherNames=false").to.not.equal(0, "false search returned zero results");
	});

	it("search wiki pages with hide deleted", async function() {
		const searchTrue = await E6Client.wikiPages.search({ hideDeleted: true });
		const searchFalse = await E6Client.wikiPages.search({ hideDeleted: false  });
		expect(searchTrue.length, "hideDeleted=true").to.not.equal(0, "true search returned zero results");
		expect(searchFalse.length, "hideDeleted=false").to.not.equal(0, "false search returned zero results");
	});

	it("search wiki pages with order", async function() {
		const search1 = await E6Client.wikiPages.search({ order: "title" });
		const search2 = await E6Client.wikiPages.search({ order: "time" });
		const search3 = await E6Client.wikiPages.search({ order: "post_count" });
		expect(search1.length, "order=title").to.not.equal(0, "order=title search returned zero results");
		expect(search2.length, "order=time").to.not.equal(0, "order=time search returned zero results");
		expect(search3.length, "order=post_count").to.not.equal(0, "order=post_count search returned zero results");
	});

	// @TODO Create Wiki Page Test
	it.skip("create wiki page", async function() {});

	// @TODO Modify Wiki Page Test
	it.skip("modify wiki page", async function() {});

	// @TODO Delete Wiki Page Test
	it.skip("delete wiki page", async function() {});

	// @TODO Revert Wiki Page Test
	it.skip("revert wiki page", async function() {});

	it("search wiki page history without query", async function() {
		const search = await E6Client.wikiPages.searchHistory();
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search wiki page history with wiki page", async function() {
		const search = await E6Client.wikiPages.searchHistory({ wikiPage: 35009 });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});
});
