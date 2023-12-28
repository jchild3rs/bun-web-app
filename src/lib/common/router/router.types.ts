export type PathRegexp = `/${string}` | string;

export type RouteHandler<Params extends object = object> = (args: {
	params: Params;
	request: Request;
}) => Response | Promise<Response>;
