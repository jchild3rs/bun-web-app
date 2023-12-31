import { Route } from "@lib/router/route";
import { NotFoundResponse } from "@lib/server/not-found-response";

export const opsRoute = new Route<{ path: string }>(
	"/ops/:path",
	({ params: { path } }) => {
		switch (path) {
			case "env":
				return new Response(JSON.stringify(Bun.env, null, 2), {
					headers: {
						"content-type": "application/json; charset=utf-8",
					},
				});
			case "heartbeat":
				return new Response("OK");
			default:
				return new NotFoundResponse();
		}
	},
);
