import { postService } from "@app/post/post.service";
import { searchFormResultsView } from "@app/search/search-form-results.view";
import { Route } from "@lib/router/route";
import { HtmlResponse } from "@lib/server/html-response";

export const searchFormResultsRoute = new Route(
	"/partial/search-form-results",
	async ({ request }) => {
		const query = new URL(request.url).searchParams.get("query");
		if (!query) return new HtmlResponse("");

		return new HtmlResponse(
			searchFormResultsView({ posts: await postService.search(query || "") }),
		);
	},
);
