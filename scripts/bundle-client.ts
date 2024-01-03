import path from "path";
import fg from "fast-glob";
import postcss from "postcss";
const log = require("debug")("app:bundle");

const isDev = process.env.NODE_ENV !== "production";

type ManifestEntry = {
	path: string;
	name: string;
	kind: string;
	hash: string | null;
	type: string;
};

const OUTPUT_PATH = "./dist";

async function copyFonts() {
	const fontSourceFonts = ["inter", "fira-code"];

	await Bun.spawn(["mkdir", "-p", "./dist/static/fonts"]).exited;

	const fontFileDirs = fontSourceFonts.map((font) => {
		return `./node_modules/@fontsource-variable/${font}`;
	});

	for (const fontFileDir of fontFileDirs) {
		await Bun.spawn(["cp", "-R", fontFileDir, "./dist/static/fonts"])
			.exited;
	}
	log("Copied fonts");
}

const postcssJitProps = require("postcss-jit-props");
const OpenProps = require("open-props");
const atImport = require("postcss-import")
const postcssCustomMedia = require('postcss-custom-media');

async function buildCSS() {

	const stylesheet = await Bun.file("./src/styles.css").text();
	const plugins: postcss.AcceptedPlugin[] = [
		atImport(),
		postcssCustomMedia(),
		postcssJitProps(OpenProps),
	];
	const result = await postcss(plugins).process(stylesheet, {
		from: "./src/styles.css",
	});

	await Bun.write(`${OUTPUT_PATH}/static/styles.css`, result.css);
	// todo
}

async function buildJS() {
	const entrypoints = await fg.glob(
		["**/client.ts", "**/src/**/client/*.ts", "**/*.client.ts"],
		{
			ignore: ["**/node_modules/**", "**/dist/**", "**/*.test.ts"],
		},
	);

	const clientResult = await Bun.build({
		entrypoints,
		outdir: `${OUTPUT_PATH}/static`,
		target: "browser",
		format: "esm",
		splitting: true,
		minify: !isDev,
		sourcemap: isDev ? "inline" : "none",
		naming: "js/[name]-[hash].[ext]",
		publicPath: "/js/",
	});

	if (!clientResult.success) {
		bail(clientResult);
	} else {
		log("Built JS");
		return clientResult;
	}
}

async function copyPublic() {
	await Bun.spawn(["cp", "-R", "./public/", `${OUTPUT_PATH}/static`]).exited;
	log("Copied public folder");
}

const [, stylesHash, clientResult] = await Promise.all([
	copyFonts(),
	buildCSS(),
	buildJS(),
	copyPublic(),
]);

// generate manifest

if (clientResult) {
	const manifest: ManifestEntry[] = [];
	for (const output of clientResult.outputs) {
		manifest.push({
			path: output.path,
			name: output.path.split("/dist")[1],
			kind: output.kind,
			hash: output.hash,
			type: output.type,
		});
	}

	manifest.push({
		name: `styles-${stylesHash}.css`,
	} as ManifestEntry);

	// write manifest to disk
	await Bun.write(
		`${OUTPUT_PATH}/manifest.json`,
		JSON.stringify(manifest, null, 2),
	);

	log("Built manifest");
}

function bail(error: unknown) {
	console.error(error);
	process.exit(1);
}
