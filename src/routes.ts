import { homePageRoute } from "@lib/home/home.route";
import { opsEnvRoute } from "@lib/ops/env.route";
import { postListPartialRoute } from "@lib/post/post-list/post-list.partial.route";
import { postPartialRoute } from "@lib/post/post.partial.route";
import { postPageRoute } from "@lib/post/post.route";
import { Route } from "@lib/router/route";
import { searchRoute } from "@lib/search/search.route";
import { createCacheControlHeaders } from "@lib/server/cache-control";

const staticAssetRoute = new Route<{ file: string[]; extension: string }>(
	"/:file*.:extension",
	({ request, params }) => {
		const filePath = `./dist/static/${params.file.join("/")}.${
			params.extension
		}`;

		const pathname = new URL(request.url).pathname;
		const headers = createCacheControlHeaders(pathname);

		return new Response(Bun.file(filePath), { headers });
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
