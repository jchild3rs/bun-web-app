import { Route } from "../../common/router/route";
import { HtmlResponse } from "../../common/server/html-response";
import { fetchPosts } from "../post.service";
import { postListView } from "./post-list.view";

export const postListPartialRoute = new Route<{ page: string }>(
	"/partial/post-list/:page",
	async ({ params }) => {
		const page = parseInt(params.page);

		return new HtmlResponse(postListView(await fetchPosts(page), page));
	},
);
