import { describe, expect, it } from "bun:test";
import { homeView } from "./home.view.ts";

describe("home view", () => {
	it("should render the home view", () => {
		expect(homeView({ page: 1, posts: [] })).toContain("Posts");
	});
});
