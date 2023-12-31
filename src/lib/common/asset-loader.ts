import { build } from "bun";
import buildManifest from "../../../dist/manifest.json";

export async function getStyles(path = "", embedded = true) {
	// const builtStylesPath = require(
	// 	join(
	// 		process.cwd(),
	// 		`./dist/static/${path ? `${path}/${path}.` : ""}styles.js`,
	// 	),
	// ).default;
	const fileName = buildManifest.find((entry) =>
		entry.name.includes(".css"),
	)?.name;
	const builtStylesPath = `./dist/static/styles/${fileName}`;
	let globalStyles;

	if (embedded) {
		globalStyles = `<style id="global-styles">${await Bun.file(
			// join(process.cwd(), "./dist/static", path, builtStylesPath),
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
	const entry = buildManifest.find((entry) => entry.name.includes(prefix));

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
