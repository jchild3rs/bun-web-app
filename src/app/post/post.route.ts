import { fetchUserById } from "@app/user/user.service";
import { getScript } from "@lib/common/asset-loader";
import { Meta } from "@lib/common/meta";
import { Route } from "@lib/router/route";
import { HtmlTemplateResponse } from "@lib/server/html-template-response";
import { postService } from "./post.service";
import { postView } from "./post.view";

const extraScripts = await getScript("post", false);

export const postPageRoute = new Route<{ id: string }>(
	"/post/:id",
	async ({ request, params }) => {
		const id = parseInt(params.id);
		const post = await postService.byId(id);
		const user = await fetchUserById(post.userId);

		const meta = new Meta({
			description: "",
			title: `${post.title} by ${user.name}`,
			// extraStyles: (await getStyles("post")) || "",
			extraScripts,
		});

		return new HtmlTemplateResponse({
			meta,

			content: `<div class="content">${postView({ post, user })}</div>`,
		});
	},
);
