import { css } from "@styled-system/css";
import { container } from "@styled-system/patterns";
import { footerView } from "../common/layout/footer.view";
import { headerView } from "../common/layout/header.view";
import { postListView } from "../post/post-list/post-list.view";
import { Post } from "../post/post.types";

export function homeView({
	page,
	posts,
}: {
	page: number;
	posts: Array<Post>;
}) {
	return `${headerView()}
			<div className=${css({ debug: true })}>Debugging outline applied</div>
			<main class="${container()}">
				<h1>Posts</h1>
				${postListView(posts, page)}
			</main>
			${footerView()}
	`;
}
