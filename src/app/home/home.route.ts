import { Route } from "@lib/router/route";
import { HtmlTemplateResponse } from "@lib/server/html-template-response";
import { postService } from "../post/post.service";
import { homeView } from "./home.view";

export const homePageRoute = new Route("/", async ({ request }) => {
	const url = new URL(request.url);
	const page = parseInt(url.searchParams.get("page") || "1");
	const content = homeView({ page, posts: await postService.all(page) });
	const meta = { title: "Home", description: "List of posts" };

	return new HtmlTemplateResponse({ meta, content });
});
