import { Route } from "../../common/router/route.ts";
import { postListView } from "./post-list.view.ts";
import { fetchPosts } from "../post.service.ts";
import { HtmlResponse } from "../../common/server/html-response.ts";

export const postListPartialRoute = new Route<{ page: string }>(
	"/partial/post-list/:page",
	async ({ params }) => {
		const page = parseInt(params.page);

		return new HtmlResponse(postListView(await fetchPosts(page), page));
	},
);
