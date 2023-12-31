export const logger = require("pino")();

export const httpLogger = (request: Request, response: Response) => {
	const requestId =
		request.headers.get("x-request-id") || require("crypto").randomUUID();

	logger.info({
		requestId,
		request: {
			method: request.method,
			url: request.url,
			headers: request.headers,
		},
		response: {
			status: response.status,
			headers: response.headers,
		},
	});
};
