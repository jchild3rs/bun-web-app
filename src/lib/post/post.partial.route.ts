import {Route} from "../common/router/route";
import {fetchUserById} from "../user/user.service";
import {fetchPostById} from "./post.service";
import {postView} from "./post.view";
import {HtmlResponse} from "../common/server/html-response.ts";

export const postPartialRoute = new Route<{ id: string }>(
	"/partial/post/:id",
	async ({ params }) => {
		const id = parseInt(params.id);
		const post = await fetchPostById(id);
		const user = await fetchUserById(post.userId);

		return new HtmlResponse(postView({ post, user }));
	},
);
