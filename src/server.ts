import { Router } from "@lib/router/router";
import { ErrorResponse } from "@lib/server/error-response";
import { NotFoundResponse } from "@lib/server/not-found-response";
import { routes } from "./routes";

const debug = require("debug")("app:server");

const router = new Router(routes);

const server = Bun.serve({
	fetch: (request) => router.handle(request) || new NotFoundResponse(),
	error: (error) => new ErrorResponse(error),
});

debug("listening on http://localhost:%d", server.port);
