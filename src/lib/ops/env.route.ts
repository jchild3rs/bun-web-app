import { Route } from "@lib/router/route";

export const opsEnvRoute = new Route(
	"/ops/env",
	() =>
		new Response(JSON.stringify(Bun.env, null, 2), {
			headers: {
				"content-type": "application/json; charset=utf-8",
			},
		}),
);
