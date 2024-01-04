import fg from "fast-glob";
import postcss from "postcss";
import * as path from "path";
import {BuildArtifact} from "bun";
const log = require("debug")("app:bundle");

const isDev = process.env.NODE_ENV !== "production";

type ManifestEntry = {
	path: string;
	publicPath: string;
	name: string;
	kind: BuildArtifact['kind'] | 'stylesheet'
	hash: string | null;
	type: string;
};

const OUTPUT_PATH = "./dist";

async function copyFonts() {
	const fontSourceFonts = ["inter", "fira-code", "playfair-display" ];

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

async function buildCSS() {
	const srcPath = "./src/styles.css";
	const destPath = `${OUTPUT_PATH}/static`;
	const openPropsPostCSSConfig = require("open-props/postcss.config.cjs");
	const plugins: postcss.AcceptedPlugin[] = [
		...openPropsPostCSSConfig.plugins,
		require("postcss-jit-props")({
			files: [
				path.resolve(__dirname, '../node_modules/open-props/open-props.min.css'),
			]
		}),
	];

	const result = await postcss(plugins).process(
		await Bun.file(srcPath).text(),
		{
			from: srcPath,
			map: isDev ? { inline: true } : false,
		},
	);

	const stylesHash = Bun.hash(result.css);
	await Bun.write(`${destPath}/styles-${stylesHash}.css`, result.css);

	log("Built CSS");

	// await Bun.write(`${OUTPUT_PATH}/static/styles.css`, result.css);

	return stylesHash;
}

const clientOutputFolder = "js/";
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
		naming: `${clientOutputFolder}[name]-[hash].[ext]`,
		publicPath: `/${clientOutputFolder}`,
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
			name: output.path.split(`/dist/static/${clientOutputFolder}`)[1],
			publicPath: output.path.split("/dist/static")[1],
			kind: output.kind,
			hash: output.hash,
			type: output.type,
		});
	}

	const cssEntry: ManifestEntry = {
		path: path.resolve(import.meta.dir, `../dist/static/styles-${stylesHash}.css`),
		name: `styles-${stylesHash}.css`,
		publicPath: `/styles-${stylesHash}.css`,
		kind: "stylesheet",
		hash: `${stylesHash}`,
		type: "text/css",
	};

	manifest.push(cssEntry);

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
