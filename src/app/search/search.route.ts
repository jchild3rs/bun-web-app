import { searchView } from "@app/search/search.view";
import { Route } from "@lib/router/route";
import { HtmlTemplateResponse } from "@lib/server/html-template-response";
import { postService } from "../post/post.service";

export const searchRoute = new Route("/search", async ({ request }) => {
	const url = new URL(request.url);
	const query = url.searchParams.get("query") || "";
	const results = await postService.search(query);

	const headline = `Search results for "${query}"`;
	const content = searchView({
		headline,
		results,
	});
	const meta = {
		title: headline,
		description: headline,
	};

	return new HtmlTemplateResponse({
		meta,
		content,
	});
});
