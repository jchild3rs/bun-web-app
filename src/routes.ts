import { homePageRoute } from "@app/home/home.route";
import { metricsRoute } from "@app/metrics.route";
import { opsRoute } from "@app/ops/ops.route";
import { postListPartialRoute } from "@app/post/post-list/post-list.partial.route";
import { postPartialRoute } from "@app/post/post.partial.route";
import { postPageRoute } from "@app/post/post.route";
import { searchFormResultsRoute } from "@app/search/search-form-results.route";
import { searchRoute } from "@app/search/search.route";
import { userProfileRoute } from "@app/user/user-profile.route";
import { staticAssetRoute } from "@lib/router/static-asset-route";

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
