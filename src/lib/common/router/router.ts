import debug from "debug";
import { Route } from "./route";
import { PathRegexp, RouteHandler } from "./router.types";

export class Router {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private readonly routes = new Map<PathRegexp, Route<any>>();
	private readonly log = debug("router");

	constructor(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		routes: Array<[PathRegexp, RouteHandler<any>] | Route<any>> = [],
	) {
		for (const route of routes) {
			if (Array.isArray(route)) {
				const [path, handler] = route;
				this.routes.set(path, new Route(path, handler));
			} else {
				this.routes.set(route.pathRegex, route);
			}
		}
	}
	private match<Params extends object>(path: string) {
		this.log("matching route %s", path);

		for (const [routePath, route] of this.routes.entries()) {
			const result = route.matcher(path);
			// biome-ignore lint/complexity/useOptionalChain: the types on path-to-regexp are wrong
			if (result && result.params) {
				return {
					routePath,
					params: result.params,
				};
			}
		}
	}

	public handle(request: Request) {
		const url = new URL(request.url);
		const path = url.pathname;

		const matchResult = this.match(path);

		if (matchResult) {
			return this.routes
				.get(matchResult.routePath)
				?.handle({ request, params: matchResult.params });
		}
	}
}
