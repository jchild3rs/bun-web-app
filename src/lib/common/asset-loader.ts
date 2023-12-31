import { DIST_PATH } from "@lib/server/server.constants";

export async function getGlobalStyles(embedded = true) {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const fileName = require(`${DIST_PATH}/manifest.json`).find((entry: any) =>
		entry.name.includes(".css"),
	)?.name;
	const builtStylesPath = `${DIST_PATH}/static/styles/${fileName}`;
	let globalStyles;

	if (embedded) {
		globalStyles = `<style id="global-styles">${await Bun.file(
			builtStylesPath,
		).text()}</style>`;
	} else {
		globalStyles = `<link rel="stylesheet" href="/styles/${fileName}">`;
	}

	return globalStyles;
}

export async function getScript(
	prefix: string,
	embedded = Bun.env.NODE_ENV === "production",
) {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const entry = require(`${DIST_PATH}/manifest.json`).find((entry: any) =>
		entry.name.includes(prefix),
	);

	if (!entry) {
		return "";
	}

	if (entry?.path && embedded) {
		let path = entry.path;
		if (Bun.env.NODE_ENV === "production") {
			path = path.replace("/dist", "");
		}
		return `<script type="module">${await Bun.file(path).text()}</script>`;
	}

	return `<script type="module" src="${entry.name.replace(
		"/static",
		"",
	)}"></script>`;
}
