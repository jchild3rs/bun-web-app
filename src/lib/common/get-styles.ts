import buildManifest from "../../../dist/manifest.json";
import {build} from "bun";

export async function getStyles(
	path = "",
	embedded = true,
) {
	// const builtStylesPath = require(
	// 	join(
	// 		process.cwd(),
	// 		`./dist/static/${path ? `${path}/${path}.` : ""}styles.js`,
	// 	),
	// ).default;
	const fileName = buildManifest.find((entry) => entry.name.includes(".css"))?.name;
	const builtStylesPath = `./dist/static/styled-system/${fileName}`;
	let globalStyles;

	if (embedded) {
		globalStyles = `<style>${await Bun.file(
			// join(process.cwd(), "./dist/static", path, builtStylesPath),
			builtStylesPath,
		).text()}</style>`;
	} else {
		globalStyles = `<link rel="stylesheet" href="/styled-system/${fileName}">`;
	}

	return globalStyles;
}

export function getScript(
	prefix: string,
	embedded = Bun.env.NODE_ENV === "production",
) {
	const entry = buildManifest.find((entry) => entry.name.includes(prefix));

	if (!entry) {
		throw new Error(`Could not find entry for ${prefix}`);
	}

	if (embedded) {
		return `<script type="module">${Bun.file(entry.path).text()}</script>`;
	}

	return `<script type="module" src="${entry.name.replace("/static", "")}"></script>`;
}

console.log(buildManifest);
