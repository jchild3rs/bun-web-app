import { notFoundView } from "../views/not-found.view";
import { HtmlTemplateResponse } from "./html-template-response";

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
