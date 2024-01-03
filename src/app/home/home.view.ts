import { postListView } from "../post/post-list/post-list.view";
import { Post } from "../post/post.types";

export function homeView({
	page,
	posts,
}: {
	page: number;
	posts: Array<Post>;
}) {
	return `
	<main class="content">
		<h1>Posts</h1>
		${postListView({ posts, page })}
	</main>
	`;
}
