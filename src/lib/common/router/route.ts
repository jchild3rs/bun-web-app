import { MatchFunction, match } from "path-to-regexp";
import { PathRegexp, RouteHandler } from "./router.types";

export class Route<Params extends object = object> {
	public matcher: MatchFunction<Params>;
	public timer: number;

	constructor(
		public pathRegex: PathRegexp,
		private readonly handler: RouteHandler<Params>,
	) {
		this.matcher = match<Params>(this.pathRegex, {
			decode: decodeURIComponent,
		});
		this.timer = Date.now();
	}

	public handle({ request, params }: { request: Request; params?: Params }) {
		if (params) {
			return this.handler({
				request,
				params,
			});
		}
	}
}
