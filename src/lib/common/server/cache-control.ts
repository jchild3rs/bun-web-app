export function createCacheControlHeaders(path?: string) {
	const headers = new Headers();
	// if is hashed asset
	if (path?.match(/[a-f0-9]{16}/g)) {
		headers.set("Cache-Control", "public, max-age=31536000, immutable");
	// is non-hashed asset (documents, fonts, favicon, things that don't change often)
	} else {
		headers.set("Cache-Control", "public, max-age=31536000");
	}

	return headers;
}
