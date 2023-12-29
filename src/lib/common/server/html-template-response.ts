import { getScript, getStyles } from "../get-styles";
import { footerView } from "../layout/footer.view";
import { headerView } from "../layout/header.view";
import { Meta, MetaObject } from "../meta";
import { createCacheControlHeaders } from "./cache-control";

const template = await Bun.file("./src/index.html").text();

const globalStyles = await getStyles();

type TemplateData = {
	meta: Meta | MetaObject;
	content: string;
};

export class HtmlTemplateResponse extends Response {
	constructor(data: TemplateData) {
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
			.replace("{{content}}", data.content)
			.replace("{{global_styles}}", globalStyles || "")
			.replace("{{global_scripts}}", getScript("client"))
			.replace("{{extra_scripts}}", data.meta.extraScripts || "")
			.replace("{{extra_styles}}", data.meta.extraStyles || "");

		const maybeCompressedHtml = Bun.env.COMPRESSION_ENABLED
			? Bun.gzipSync(Buffer.from(htmlToServe))
			: htmlToServe;

		// const cacheControlHeaders = createCacheControlHeaders()

		super(maybeCompressedHtml, {
			headers: {
				"Content-Type": "text/html",
				...(Bun.env.COMPRESSION_ENABLED && { "Content-Encoding": "gzip" }),
				// 'cache-control': cacheControlHeaders.get('cache-control'),
			},
		});
	}
}
