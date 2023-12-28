import { join } from "path";

export async function getStyles(path = "", embedded = false) {
	// const builtStylesPath = require(
	// 	join(
	// 		process.cwd(),
	// 		`./dist/static/${path ? `${path}/${path}.` : ""}styles.js`,
	// 	),
	// ).default;
	const builtStylesPath = './styled-system/styles.css'
	let globalStyles;

	if (embedded) {
		globalStyles = `<style data-route="${path}">${await Bun.file(
			// join(process.cwd(), "./dist/static", path, builtStylesPath),
			builtStylesPath,
		).text()}</style>`;
	} else {
		globalStyles = `<link rel="stylesheet" href="/${getFilename(
			builtStylesPath,
		)}">`;
	}

	return globalStyles;
}

function getFilename(path: string) {
	return path.split("/").pop() || "";
}
