import { Router } from "@lib/common/router/router";
import { ErrorResponse } from "@lib/common/server/error-response.ts";
import { NotFoundResponse } from "@lib/common/server/not-found-response.ts";

import { routes } from "./routes.ts";

const debug = require("debug")("server");
const router = new Router(routes);

const server = Bun.serve({
	port: Bun.env.PORT || 3000,
	fetch(request) {
		return router.handle(request) || new NotFoundResponse();
	},
	error(error) {
		return new ErrorResponse(error);
	},
});

debug("listening on http://localhost:%d", server.port);
