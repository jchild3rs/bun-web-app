import { Route } from "@lib/router/route";
import { createCacheControlHeaders } from "@lib/server/cache-control";
import { DIST_PATH } from "@lib/server/server.constants";

export const staticAssetRoute = new Route<{
	file: string[];
	extension: string;
}>("/:file*.:extension", ({ request, params }) => {
	const filePath = `${DIST_PATH}/static/${params.file.join("/")}.${
		params.extension
	}`;

	const pathname = new URL(request.url).pathname;
	const headers = createCacheControlHeaders(pathname);

	return new Response(Bun.file(filePath), { headers });
});
