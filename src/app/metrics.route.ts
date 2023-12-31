import { Route } from "@lib/router/route";
// import { register } from "@lib/metrics/prometheus";

export const metricsRoute = new Route("/metrics", async () => {
	return new Response("");
	// NotImplementedError: PerformanceObserver is not yet implemented in Bun.
	// @see https://github.com/oven-sh/bun/issues/4708
	// return new Response(await register.metrics(), {
	// 	headers: {
	// 		"content-type": register.contentType,
	// 	},
	// });
});
