import { layoutView } from "@app/layout.view";
import { createCacheControlHeaders } from "@lib/server/cache-control";
import { DIST_PATH } from "@lib/server/server.constants";
import {getScript, getStyles} from "../common/asset-loader";
import { Meta, MetaObject } from "../common/meta";

type FontManifest = {
	styles: string[];
	defSubset: string;
};

async function loadFont(fontName: string): Promise<{
	manifest: FontManifest;
	styles: string;
	preload: string;
}> {
	const manifest: FontManifest = JSON.parse(
		await Bun.file(
			`${DIST_PATH}/static/fonts/${fontName}/metadata.json`,
		).text(),
	);

	const styles = await Bun.file(
		`${DIST_PATH}/static/fonts/${fontName}/wght.css`,
	).text();

	return {
		manifest,
		styles: styles.replaceAll("./files", `/fonts/${fontName}/files`),
		preload: manifest.styles
			.map(
				(style) =>
					`<link rel="preload" href="/fonts/${fontName}/files/${fontName}-${manifest.defSubset}-wght-${style}.woff2" as="font" type="font/woff2" crossorigin />`,
			)
			.join("\n"),
	};
}

function loadStylesheet(path: string) {
	return Bun.file(path).text();
}

const inter = await loadFont("inter");
const firaCode = await loadFont("fira-code");
const playfairDisplay = await loadFont("playfair-display");

const template = await Bun.file("./index.html").text();

const globalStyles = `${inter.preload}
 ${playfairDisplay.preload}
<style>	
${inter.styles}
${firaCode.styles}
${playfairDisplay.styles}

${await getStyles("styles")}
</style>`;

const globalScripts = `
<script src="https://unpkg.com/htmx.org@1.9.10/dist/htmx.min.js"></script>
${await getScript("client")}
${await getScript("search-form.view")}
`;

const criticalScripts = `<script src="https://www.googletagmanager.com/gtag/js?id=XXXXX"></script>`;

type TemplateData = {
	meta: Meta | MetaObject;
	content: string;
};

export class HtmlTemplateResponse extends Response {
	constructor(data: TemplateData, options?: ResponseInit) {
		const htmlToServe = template
			.replace("{{title}}", data.meta.title || "")
			.replace(
				"{{prefetch}}",
				data.meta.prefetch
					?.map(
						(data) =>
							`<link rel="prefetch" href="${data.href}" as="${data.as}" />`,
					)
					.join("\n") || "",
			)
			.replace("{{description}}", data.meta.description || "")
			.replace("{{content}}", layoutView(data.content))
			.replace("{{critical_scripts}}", criticalScripts || "")
			.replace("{{global_styles}}", globalStyles || "")
			.replace("{{global_scripts}}", globalScripts || "")
			.replace("{{extra_scripts}}", data.meta.extraScripts || "");

		const maybeCompressedHtml = Bun.env.COMPRESSION_ENABLED
			? Bun.gzipSync(Buffer.from(htmlToServe))
			: htmlToServe;

		const cacheControlHeaders = createCacheControlHeaders();

		super(maybeCompressedHtml, {
			...options,
			headers: {
				"Cache-Control": cacheControlHeaders.get("cache-control") || "",
				"Content-Type": "text/html",
				...(Bun.env.COMPRESSION_ENABLED && {
					"Content-Encoding": "gzip",
				}),
			},
		});
	}
}
