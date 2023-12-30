import { layoutView } from "@lib/layout.view";
import { createCacheControlHeaders } from "@lib/server/cache-control";
import { getScript, getStyles } from "../common/asset-loader";
import { Meta, MetaObject } from "../common/meta";
import HeadersInit = Bun.HeadersInit;

const template = await Bun.file("./src/index.html").text();

const globalStyles = `
 <link rel="preload" href="/fonts/inter/files/inter-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
 <link rel="preload" href="/fonts/inter/files/inter-latin-700-normal.woff2" as="font" type="font/woff2" crossorigin>

<style>${(
	await Bun.file("./dist/static/fonts/inter/latin.css").text()
).replaceAll("./files", "/fonts/inter/files")}</style>
<style>${(
	await Bun.file("./dist/static/fonts/fira-code/latin.css").text()
).replaceAll("./files", "/fonts/fira-code/files")}</style>
${await getStyles()}`;
const globalScripts = await getScript("client");

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
				"Content-Type": "text/html",
				...(Bun.env.COMPRESSION_ENABLED && { "Content-Encoding": "gzip" }),
				"cache-control": cacheControlHeaders.get("cache-control") || "",
			},
		});
	}
}
