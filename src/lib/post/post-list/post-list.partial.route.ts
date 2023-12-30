import { Route } from "@lib/router/route";
import { HtmlResponse } from "@lib/server/html-response";
import { postService } from "../post.service";
import { postListView } from "./post-list.view";

export const postListPartialRoute = new Route<{ page: string }>(
	"/partial/post-list/:page",
	async ({ params }) => {
		const page = parseInt(params.page);

		return new HtmlResponse(postListView(await postService.all(page), page));
	},
);
