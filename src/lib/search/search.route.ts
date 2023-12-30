import { getScript } from "@lib/common/asset-loader";
import { Route } from "@lib/router/route";
import { HtmlTemplateResponse } from "@lib/server/html-template-response";
import { postService } from "../post/post.service";
import { searchFormView } from "./search-form.view";

export const searchRoute = new Route("/search", async ({ request }) => {
	const url = new URL(request.url);
	const query = url.searchParams.get("query") || "";
	const results = await postService.search(query);

	const headline = `Search results for "${query}"`;
	const html = `
	<div class="prose">
	<h3>${headline}</h3>
	${searchFormView()}
	${searchFormView()}
	${searchFormView()}
<ul>
${results
	.map((result) => `<li><a href="/post/${result.id}">${result.title}</a></li>`)
	.join("")}
</ul>
</div>
	`;

	return new HtmlTemplateResponse({
		meta: {
			title: headline,
			description: headline,
			extraScripts: await getScript("search-form.view"),
		},
		content: html,
	});
});
