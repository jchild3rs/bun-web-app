import { Route } from "@lib/router/route";
import { HtmlResponse } from "@lib/server/html-response";
import { fetchUserById } from "../user/user.service";
import { postService } from "./post.service";
import { postView } from "./post.view";

export const postPartialRoute = new Route<{ id: string }>(
	"/partial/post/:id",
	async ({ params }) => {
		const id = parseInt(params.id);
		const post = await postService.byId(id);
		const [user, photo] = await Promise.all([
			fetchUserById(post.userId),
			postService.photosByPostId(id),
		]);

		return new HtmlResponse(postView({ photo, post, user }));
	},
);
