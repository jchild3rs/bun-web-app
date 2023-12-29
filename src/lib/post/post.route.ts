import { getScript } from "../common/get-styles";
import { Meta } from "../common/meta";
import { Route } from "../common/router/route";
import { HtmlTemplateResponse } from "../common/server/html-template-response";
import { fetchUserById } from "../user/user.service";
import { fetchPostById } from "./post.service";
import { postView } from "./post.view";

export const postPageRoute = new Route<{ id: string }>(
	"/post/:id",
	async ({ request, params }) => {
		const id = parseInt(params.id);
		const post = await fetchPostById(id);
		const user = await fetchUserById(post.userId);

		const meta = new Meta({
			description: "",
			title: `${post.title} by ${user.name}`,
			// extraStyles: (await getStyles("post")) || "",
			extraScripts: getScript("post"),
		});

		return new HtmlTemplateResponse({
			meta,
			content: postView({ post, user }),
		});
	},
);
