import { homePageRoute } from "@app/home/home.route";
import { metricsRoute } from "@app/metrics.route";
import { opsRoute } from "@app/ops/ops.route";
import { postListPartialRoute } from "@app/post/post-list/post-list.partial.route";
import { postPartialRoute } from "@app/post/post.partial.route";
import { postPageRoute } from "@app/post/post.route";
import { searchFormResultsRoute } from "@app/search/search-form-results.route";
import { searchRoute } from "@app/search/search.route";
import { userProfileRoute } from "@app/user/user-profile.route";
import { Route } from "@lib/router/route";
import { createCacheControlHeaders } from "@lib/server/cache-control";
import { DIST_PATH } from "@lib/server/server.constants";

const staticAssetRoute = new Route<{ file: string[]; extension: string }>(
	"/:file*.:extension",
	({ request, params }) => {
		const filePath = `${DIST_PATH}/static/${params.file.join("/")}.${
			params.extension
		}`;

		const pathname = new URL(request.url).pathname;
		const headers = createCacheControlHeaders(pathname);

		return new Response(Bun.file(filePath), { headers });
	},
);

export const routes = [
	metricsRoute,
	staticAssetRoute,
	postListPartialRoute,
	homePageRoute,
	searchRoute,
	postPageRoute,
	postPartialRoute,
	userProfileRoute,
	searchFormResultsRoute,
	opsRoute,
];
