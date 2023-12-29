import { copyFileSync, existsSync, mkdirSync, readdirSync } from "fs";

import fg from "fast-glob";

const log = require("debug")("bundle");

const OUTPUT_PATH = "./dist";

const entrypoints = await fg.glob(["**/client.ts", "**/lib/**/*.client.ts"], {
	dot: true,
});

const clientResult = await Bun.build({
	entrypoints,
	outdir: `${OUTPUT_PATH}/static`,
	target: "browser",
	format: "esm",
	naming: "js/[name]-[hash].[ext]",
});

if (clientResult.success) {
	// generate manifest
	const manifest: {
		path: string;
		name: string;
		kind: string;
		hash: string | null;
		type: string;
	}[] = [];

	for (const output of clientResult.outputs) {
		manifest.push({
			path: output.path,
			name: output.path.split("/dist")[1],
			kind: output.kind,
			hash: output.hash,
			type: output.type,
		});
	}


	const hash = Bun.hash(await Bun.file("./dist/static/styled-system/styles.css").arrayBuffer())
	const file = Bun.file("./dist/static/styled-system/styles.css");
	await Bun.write(`./dist/static/styled-system/styles-${hash}.css`, file);

	manifest.push({
		name: `styles-${hash}.css`
	} as {
		path: string;
		name: string;
		kind: string;
		hash: string | null;
		type: string;
	})

	await Bun.write("./dist/manifest.json", JSON.stringify(manifest, null, 2));

	// write manifest to disk
	await Bun.write(
		`${OUTPUT_PATH}/manifest.json`,
		JSON.stringify(manifest, null, 2),
	);
}

copyDirectory("./public", `${OUTPUT_PATH}/static`);

function copyDirectory(source: string, destination: string) {
	const files = readdirSync(source);
	if (!existsSync(destination)) {
		mkdirSync(destination);
	}

	for (const file of files) {
		const sourcePath = `${source}/${file}`;
		const destinationPath = `${destination}/${file}`;
		if (!file.includes(".")) {
			copyDirectory(sourcePath, destinationPath);
		} else {
			copyFileSync(sourcePath, destinationPath);
		}
	}
}

const serverResult = await Bun.build({
	entrypoints: ["./src/server.ts"],
	outdir: OUTPUT_PATH,
	target: "bun",
});

if (serverResult.success) {
	log("server build success");
}
