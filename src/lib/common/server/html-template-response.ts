import { getStyles } from "../get-styles.ts";
import { footerView } from "../layout/footer.view.ts";
import { headerView } from "../layout/header.view.ts";
import { Meta, MetaObject } from "../meta.ts";

const template = await Bun.file("./src/index.html").text();

const globalStyles = await getStyles();

type TemplateData = {
	meta: Meta | MetaObject;
	content: string;
};

export class HtmlTemplateResponse extends Response {
	constructor(data: TemplateData, options?: ResponseInit) {
		const htmlToServe = template
			.replace("{{title}}", data.meta.title || "")
			.replace("{{description}}", data.meta.description || "")
			.replace("{{content}}", data.content)
			.replace("{{global_styles}}", globalStyles || "")
			.replace("{{global_scripts}}", '<script src="/client.js"></script>')
			.replace("{{extra_scripts}}", data.meta.extraScripts || "")
			.replace("{{extra_styles}}", data.meta.extraStyles || "");

		const maybeCompressedHtml = Bun.env.COMPRESSION_ENABLED
			? Bun.gzipSync(Buffer.from(htmlToServe))
			: htmlToServe;

		super(maybeCompressedHtml, {
			...options,
			headers: {
				...options?.headers,
				"Content-Type": "text/html",
				...(Bun.env.COMPRESSION_ENABLED && { "Content-Encoding": "gzip" }),
			},
		});
	}
}
