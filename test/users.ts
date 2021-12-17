/* eslint-disable @typescript-eslint/no-empty-function */
import { E6Client } from "./E6Client";
import type { User } from "../build/src";
import { APIError } from "../build/src";
import { expect } from "chai";
import debug from "debug";
import "mocha";

const skipAuthRequired = true;
debug.enable("e621:*");
describe("Users", function() {
	it("get user by id", async function() {
		const user = await E6Client.users.get(323290);
		expect(user).to.not.equal(null, "failed to get post set");
	});

	it("get user by name (get)", async function() {
		const user = await E6Client.users.get("donovan_dmc");
		expect(user).to.not.equal(null, "failed to get post set");
	});

	it("get user by name (getByName)", async function() {
		const user = await E6Client.users.getByName("donovan_dmc");
		expect(user).to.not.equal(null, "failed to get post set");
	});

	it("search users without query", async function() {
		const search = await E6Client.users.search();
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("search users by name", async function() {
		const search = await E6Client.users.search({ name: "donovan_dmc" });
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	it("(requires admin) search users by email", async function() {
		if (skipAuthRequired) this.skip();
		let search: Array<User>;
		try {
			search = await E6Client.users.search({ email: "admin@e621.net" });
		} catch (err) {
			if (err instanceof APIError) {
				if (err.statusCode === 403) {
					console.error("You do not have the right privileges to search users by email.");
					return this.skip();
				} else throw err;
			} else throw err;
		}
		expect(search.length).to.not.equal(0, "search returned zero results");
	});

	// there's anywhere between 0 and infinity levels with ids that change, no test can cover that

	it("search users by unrestricted uploads", async function() {
		const searchTrue = await E6Client.users.search({ unrestrictedUploads: true });
		const searchFalse = await E6Client.users.search({ unrestrictedUploads: false  });
		expect(searchTrue.length, "unrestrictedUploads=true").to.not.equal(0, "true search returned zero results");
		expect(searchFalse.length, "unrestrictedUploads=false").to.not.equal(0, "false search returned zero results");
	});

	it("search users by approver", async function() {
		const searchTrue = await E6Client.users.search({ approver: true });
		const searchFalse = await E6Client.users.search({ approver: false  });
		expect(searchTrue.length, "approver=true").to.not.equal(0, "true search returned zero results");
		expect(searchFalse.length, "approver=false").to.not.equal(0, "false search returned zero results");
	});

	it("search users with order", async function() {
		const search1 = await E6Client.users.search({ order: "date" });
		const search2 = await E6Client.users.search({ order: "name" });
		const search3 = await E6Client.users.search({ order: "post_upload_count" });
		const search4 = await E6Client.users.search({ order: "note_count" });
		const search5 = await E6Client.users.search({ order: "post_update_count" });
		expect(search1.length, "order=date").to.not.equal(0, "order=date search returned zero results");
		expect(search2.length, "order=name").to.not.equal(0, "order=name search returned zero results");
		expect(search3.length, "order=note_count").to.not.equal(0, "order=note_count search returned zero results");
		expect(search4.length, "order=note_count").to.not.equal(0, "order=note_count search returned zero results");
		expect(search5.length, "order=post_update_count").to.not.equal(0, "order=post_update_count search returned zero results");
	});

	// @TODO Get Self Test
	it.skip("get self", async function() {});

	// @TODO Edit Self Test
	it.skip("edit self", async function() {});

	// @TODO Get Upload Limit Test
	it.skip("get upload limit", async function() {});

	// @TODO Get Favorites Test
	it.skip("get favorites", async function() {});

	// @TODO Add Favorite Test
	it.skip("add favorite", async function() {});

	// @TODO Remove Favorite Test
	it.skip("remove favorite", async function() {});

	// @TODO
	it.skip("", async function() {});
});
