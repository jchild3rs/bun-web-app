export class HtmlResponse extends Response {
	constructor(html: string, options?: ResponseInit) {
		const maybeCompressedHtml = Bun.env.COMPRESSION_ENABLED
			? Bun.gzipSync(Buffer.from(html))
			: html;

		super(maybeCompressedHtml, {
			...options,
			headers: {
				...options?.headers,
				"Content-Type": "text/html",
				...(Bun.env.COMPRESSION_ENABLED && { "Content-Encoding": "gzip" }),
			},
		});
	}
}
