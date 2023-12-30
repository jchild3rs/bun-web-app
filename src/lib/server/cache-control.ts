export function createCacheControlHeaders(path?: string) {
	const headers = new Headers();
	// if is hashed asset
	if (Bun.env.NODE_ENV !== "production") {
		headers.set("Cache-Control", "no-cache");
		return headers;
	}

	const isFont = path?.match(/(woff|woff2|ttf|otf|eot)$/g);
	const isHashedAsset = path?.match(/[a-f0-9]{16}/g);
	const isFavicon = path?.match(/favicon/g);

	if (isHashedAsset || isFont || isFavicon) {
		headers.set("Cache-Control", "public, max-age=31536000, immutable");
		// is non-hashed asset (documents, fonts, favicon, things that don't change often)
	} else {
		headers.set("Cache-Control", "public, max-age=31536000");
	}

	return headers;
}
