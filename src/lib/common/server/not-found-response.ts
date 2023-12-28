import { notFoundView } from "../views/not-found.view.ts";
import { HtmlTemplateResponse } from "./html-template-response.ts";

export class NotFoundResponse extends HtmlTemplateResponse {
	constructor() {
		super(
			{
				meta: {
					title: "Not Found",
				},
				content: notFoundView(),
			},
			{ status: 404 },
		);
	}
}
