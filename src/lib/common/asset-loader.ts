export async function getGlobalStyles(embedded = true) {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const fileName = require("../../../dist/manifest.json").find((entry: any) =>
		entry.name.includes(".css"),
	)?.name;
	const builtStylesPath = `./dist/static/styles/${fileName}`;
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
	const entry = require("../../../dist/manifest.json").find((entry: any) =>
		entry.name.includes(prefix),
	);

	if (!entry) {
		return "";
	}

	if (entry?.path && embedded) {
		return `<script type="module">${await Bun.file(
			entry.path,
		).text()}</script>`;
	}

	return `<script type="module" src="${entry.name.replace(
		"/static",
		"",
	)}"></script>`;
}
