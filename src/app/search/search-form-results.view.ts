import { Post } from "@app/post/post.types";

export const searchFormResultsView = ({
	posts,
}: {
	posts: Post[];
}) =>
	posts
		.map(
			(post) =>
				`<li hx-boost="true" role="option" id="search-form-result-${post.id}" data-value="${post.id}" data-href="/post/${post.id}">
	${post.title}
</li>`,
		)
		.join("\n");
