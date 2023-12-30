import { getScript } from "@lib/common/asset-loader";
import { extractPrefixFromPath } from "@lib/common/utils/extract-prefix-from-path";
import { Meta } from "@lib/common/meta";
import { Route } from "@lib/router/route";
import { HtmlTemplateResponse } from "@lib/server/html-template-response";
import { fetchUserById } from "@lib/user/user.service";
import { postService } from "./post.service";
import { postView } from "./post.view";

const extraScripts = await getScript(
	extractPrefixFromPath(import.meta.url),
	false,
);

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

			content: postView({ post, user }),
		});
	},
);
