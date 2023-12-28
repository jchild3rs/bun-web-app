import { Route } from "../common/router/route";
import { HtmlTemplateResponse } from "../common/server/html-template-response.ts";
import { fetchPosts } from "../post/post.service";
import { homeView } from "./home.view";

export const homePageRoute = new Route("/", async ({ request }) => {
	const url = new URL(request.url);
	const page = parseInt(url.searchParams.get("page") || "1");
	const content = homeView({ page, posts: await fetchPosts(page) });
	const meta = { title: "Home", description: "List of posts" };

	return new HtmlTemplateResponse({ meta, content });
});
