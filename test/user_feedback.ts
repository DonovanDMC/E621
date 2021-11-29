import { expect } from "chai";
import { E6Client } from "./E6Client";
import "mocha";

const skipAuthRequired = true;
describe("User Feedback", function() {
	it("get user feedback by id", async function() {
		const feedback = await E6Client.userFeedback.get(48702);
		expect(feedback).to.not.equal(null, "failed to get post set");
	});

	it("search user feedback without query", async function() {
		const search = await E6Client.userFeedback.search();
		expect(search.length).to.not.equal(0, "search returned zero results");
	});
	
	it("search user feedback by username", async function() {
		const search = await E6Client.userFeedback.search({ username: "donovan_dmc" });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});
	
	it("search user feedback by creator", async function() {
		const search = await E6Client.userFeedback.search({ username: "millcore" });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});
	
	it("search user feedback by body", async function() {
		const search = await E6Client.userFeedback.search({ body: "Thanks for helping out so much with tags, sources, and ratings!! [color=#add8e6]<3[/color]" });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});
	
	it("search user feedback by category", async function() {
		const search1 = await E6Client.userFeedback.search({ category: "positive" });
		const search2 = await E6Client.userFeedback.search({ category: "neutral" });
		const search3 = await E6Client.userFeedback.search({ category: "negative" });
		expect(search1.length, "category=positive").to.not.equal(0, "category=positive search returned zero results");
		expect(search2.length, "category=neutral").to.not.equal(0, "category=neutral search returned zero results");
		expect(search3.length, "category=negative").to.not.equal(0, "category=negative search returned zero results");
	});

	// @TODO Create User Feedback Test
	it.skip("create user feedback", async function() {});

	// @TODO Modify User Feedback Test
	it.skip("modify user feedback", async function() {});

	// @TODO Delete User Feedback Test
	it.skip("delete user feedback", async function() {});
});
