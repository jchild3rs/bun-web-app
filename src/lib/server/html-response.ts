export class HtmlResponse extends Response {
	constructor(html: string) {
		const maybeCompressedHtml = Bun.env.COMPRESSION_ENABLED
			? Bun.gzipSync(Buffer.from(html))
			: html;

		const headers = new Headers();
		headers.set("Content-Type", "text/html");
		if (Bun.env.COMPRESSION_ENABLED) {
			headers.set("Content-Encoding", "gzip");
		}

		super(maybeCompressedHtml, { headers });
	}
}
