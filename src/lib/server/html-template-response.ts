import { layoutView } from "@app/layout.view";
import { createCacheControlHeaders } from "@lib/server/cache-control";
import { DIST_PATH } from "@lib/server/server.constants";
import { getScript } from "../common/asset-loader";
import { Meta, MetaObject } from "../common/meta";

const interManifest: {
	styles: string[];
	defSubset: string;
} = JSON.parse(
	await Bun.file(`${DIST_PATH}/static/fonts/inter/metadata.json`).text(),
);
const template = await Bun.file("./index.html").text();
const globalStyles = `
 ${interManifest.styles
		.map(
			(style) =>
				`<link rel="preload" href="/fonts/inter/files/inter-${interManifest.defSubset}-wght-${style}.woff2" as="font" type="font/woff2" crossorigin>`,
		)
		.join("\n")}
<style>${(
	await Bun.file(`${DIST_PATH}/static/fonts/inter/wght.css`).text()
).replaceAll("./files", "/fonts/inter/files")}
  
  body {
   font-family: 'Inter', sans-serif;
  }
</style>
<style>${(
	await Bun.file(`${DIST_PATH}/static/fonts/fira-code/wght.css`).text()
).replaceAll("./files", "/fonts/fira-code/files")}</style>
`;

const globalScripts = `
<script type="importmap">
  ${JSON.stringify(require(`${DIST_PATH}/importmap.json`), null, 2)}
</script>
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
