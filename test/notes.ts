/* eslint-disable @typescript-eslint/no-empty-function */
import { E6Client } from "./E6Client";
import { expect } from "chai";
import debug from "debug";
import "mocha";

const skipAuthRequired = true;
debug.enable("e621:*");
describe("Notes", function() {
	it("get note by id", async function() {
		const note = await E6Client.notes.get(308103);
		expect(note).to.not.equal(null, "failed to get artist");
	});

	it("search notes without query", async function() {
		const search = await E6Client.notes.search();
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search notes by body", async function() {
		const search = await E6Client.notes.search({ body: "Suck my diiick" });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search notes by author", async function() {
		const search = await E6Client.notes.search({ author: "ShadyGuy" });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search notes by tags", async function() {
		const search = await E6Client.notes.search({ tags: "male/male" });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	// @TODO Create Note Test
	it.skip("create note", async function() {});

	// @TODO Modify Note Test
	it.skip("modify note", async function() {});

	// @TODO Delete Note Test
	it.skip("delete note", async function() {});

	it("search notes history without query", async function() {
		const search = await E6Client.notes.searchHistory();
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search note history by note id", async function() {
		const search = await E6Client.notes.searchHistory({ noteId: 308103 });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search note history by post id", async function() {
		const search = await E6Client.notes.searchHistory({ postId: 2998111 });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search note history by note body", async function() {
		if (skipAuthRequired) this.skip();
		const search = await E6Client.notes.searchHistory({ body: "Suck my diiick" });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});
});
