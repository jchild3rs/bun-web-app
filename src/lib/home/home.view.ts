import { footerView } from "../common/layout/footer.view.ts";
import { headerView } from "../common/layout/header.view.ts";
import { postListView } from "../post/post-list/post-list.view.ts";
import { Post } from "../post/post.types.ts";
import { container } from "@styled-system/patterns";

export function homeView({
	page,
	posts,
}: {
	page: number;
	posts: Array<Post>;
}) {
	return `
			${headerView()}
			<main class="${container()}">
				<h1>Posts</h1>
				${postListView(posts, page)}
			</main>
			${footerView()}
	`;
}
