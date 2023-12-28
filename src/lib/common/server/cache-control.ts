export function applyCacheControlHeaders(request: Request) {
	const url = new URL(request.url);
	// if is hashed asset
	if (url.pathname.match(/[a-f0-9]{16}/g)) {
		request.headers.set("Cache-Control", "public, max-age=31536000, immutable");
		// is non-hashed asset (fonts, favicon, things that don't change often)
	} else if (url.pathname.includes(".")) {
		request.headers.set("Cache-Control", "public, max-age=31536000");
	}
}
