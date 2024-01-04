import { DIST_PATH } from "@lib/server/server.constants";

const manifest = require(`${DIST_PATH}/manifest.json`);
export async function getStyles(name: string): Promise<string> {
	const cssEntry = manifest.find(
		// biome-ignore lint/suspicious/noExplicitAny: <todo explanation>
		(entry: any) =>
			entry.kind === "stylesheet" && entry.name.includes(name),
	);

	return cssEntry ? Bun.file(cssEntry.path).text() : "";
}

export async function getScript(
	prefix: string,
	embedded = Bun.env.NODE_ENV === "production",
) {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const entry = manifest.find((entry: any) => entry.name.includes(prefix));

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

	return `<script type="module" src="${entry.publicPath}"></script>`;
}
