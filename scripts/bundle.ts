import {
	copyFileSync,
	existsSync,
	mkdirSync,
	readdirSync,
	rmdirSync,
} from "fs";

import fg from "fast-glob";

const OUTPUT_PATH = "./dist";
const IS_PROD = process.env.NODE_ENV === "production";

// remove destination if it exists (using nodejs)
if (existsSync(OUTPUT_PATH)) {
	rmdirSync(OUTPUT_PATH, { recursive: true });
}

const globalStyleResult = await Bun.build({
	entrypoints: ["./src/styles.css", "./src/client.ts"],
	outdir: `${OUTPUT_PATH}/static`,
	target: "browser",
	naming: "[dir]/[name].[ext]",
	// sourcemap: IS_PROD ? "none" : "inline",
});

if (globalStyleResult.success) {
	console.log("global style build success");
} else {
	console.error(globalStyleResult);
	process.exit(1);
}
//
const entrypoints = await fg.glob(["**/lib/**/*.client.ts", "**/lib/**/*.styles.css"], { dot: true });

await Bun.build({
	entrypoints,
	outdir: `${OUTPUT_PATH}/static`,
	target: "browser",
	// format: "esm",
	// naming: `[dir]/[name].${route}.[ext]`,
	// sourcemap: IS_PROD ? "none" : "inline",
}).catch(console.error)

copyDirectory("./public", `${OUTPUT_PATH}/static`);

const file = Bun.file("./styled-system/styles.css");
await Bun.write(`${OUTPUT_PATH}/static/styles.css`, file);

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
	console.log("server build success");
}
