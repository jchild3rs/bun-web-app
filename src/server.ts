import { httpLogger, logger } from "@lib/common/logger";
import { Router } from "@lib/router/router";
import { ErrorResponse } from "@lib/server/error-response";
import { NotFoundResponse } from "@lib/server/not-found-response";
import { routes } from "./routes";
// import { collectDefaultMetrics } from "prom-client";
// import { register } from "@lib/metrics/prometheus";
//
// collectDefaultMetrics({ register });

const debug = require("debug")("app:server");
const router = new Router(routes);

const server = Bun.serve({
	async fetch(request) {
		const response = await (router.handle(request) ||
			new NotFoundResponse());

		httpLogger(request, response);

		return response;
	},
	error(error) {
		console.error(error);

		return new ErrorResponse(error);
	},
});

debug("listening on http://localhost:%d", server.port);
