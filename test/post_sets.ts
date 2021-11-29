import { expect } from "chai";
import { E6Client } from "./E6Client";
import "mocha";

const skipAuthRequired = true;
describe("Post Sets", function() {
	it("get post set by id", async function() {
		const postSet = await E6Client.postSets.get(26062);
		expect(postSet).to.not.equal(null, "failed to get post set");
	});

	it("get post set by name", async function() {
		const postSet = await E6Client.postSets.getByName("Paw Beans");
		expect(postSet).to.not.equal(null, "failed to get post set");
	});

	it("get post set by short name", async function() {
		const postSet = await E6Client.postSets.getByShortName("pawbeans");
		expect(postSet).to.not.equal(null, "failed to get post set");
	});
	
	it("search post sets without query", async function() {
		const search = await E6Client.postSets.search();
		expect(search.length).to.not.equal(0, "search returned zero results");
	});
	
	it("search post sets by name", async function() {
		const search = await E6Client.postSets.search({ name: "Paw Beans" });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});
	
	it("search post sets by short name", async function() {
		const search = await E6Client.postSets.search({ shortname: "pawbeans" });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});
	
	it("search post sets by creator name", async function() {
		const search = await E6Client.postSets.search({ username: "donovan_dmc" });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});
	
	it("search post sets with order", async function() {
		const search1 = await E6Client.postSets.search({ order: "name" });
		const search2 = await E6Client.postSets.search({ order: "shortname" });
		const search3 = await E6Client.postSets.search({ order: "postcount" });
		const search4 = await E6Client.postSets.search({ order: "created_at" });
		const search5 = await E6Client.postSets.search({ order: "update" });
		expect(search1.length, "order=name").to.not.equal(0, "order=name search returned zero results");
		expect(search2.length, "order=shortname").to.not.equal(0, "order=shortname search returned zero results");
		expect(search3.length, "order=postcount").to.not.equal(0, "order=postcount search returned zero results");
		expect(search4.length, "order=created_at").to.not.equal(0, "order=created_at search returned zero results");
		expect(search5.length, "order=update").to.not.equal(0, "order=update search returned zero results");
	});

	// @TODO Create Post Set Test
	it.skip("create post set", async function() {});

	// @TODO Modify Post Set Test
	it.skip("modify post set", async function() {});

	// @TODO Delete Post Set Test
	it.skip("delete post set", async function() {});

	// @TODO Add Post To Post Set Test
	it.skip("add post to post set", async function() {});

	// @TODO Remove Post From Post Set Test
	it.skip("remove post from post set", async function() {});
});
