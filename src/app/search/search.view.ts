import { Post } from "@app/post/post.types";
import { searchFormView } from "@app/search/search-form.view";

export const searchView = ({
	headline,
	results,
}: {
	headline: string;
	results: Post[];
}) => `
	<div class="prose">
	<h3>${headline}</h3>
	${searchFormView()}
	${searchFormView()}
	${searchFormView()}
<ul>
${results
	.map(
		(result) => `<li><a href="/post/${result.id}">${result.title}</a></li>`,
	)
	.join("")}
</ul>
</div>
	`;
