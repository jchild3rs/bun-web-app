import { postListPartialRoute } from "@lib/post/post-list/post-list.partial.route.ts";
import { homePageRoute } from "@lib/home/home.route.ts";
import { searchRoute } from "@lib/search/search.route.ts";
import { postPageRoute } from "@lib/post/post.route.ts";
import { postPartialRoute } from "@lib/post/post.partial.route.ts";
import { opsEnvRoute } from "@lib/ops/env.route.ts";
import { Route } from "@lib/common/router/route.ts";
import { applyCacheControlHeaders } from "@lib/common/server/cache-control.ts";

const staticAssetRoute = new Route<{ file: string[]; extension: string }>(
	"/:file*.:extension",
	({ request, params }) => {
		const filePath = `./dist/static/${params.file.join("/")}.${
			params.extension
		}`;

		applyCacheControlHeaders(request);

		return new Response(Bun.file(filePath), { headers: request.headers });
	},
);

export const routes = [
	staticAssetRoute,
	postListPartialRoute,
	homePageRoute,
	searchRoute,
	postPageRoute,
	postPartialRoute,
	opsEnvRoute,
];
