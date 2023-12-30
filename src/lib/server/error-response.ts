import { type Errorlike } from "bun";
import { notFoundView } from "../404.view";
import { errorView } from "../500.view";
import { HtmlTemplateResponse } from "./html-template-response";

export class ErrorResponse extends HtmlTemplateResponse {
	constructor(error: Errorlike) {
		let status = 500;
		let content: string;
		if (error.code === "ENOENT") {
			status = 400;
			content = notFoundView();
		} else {
			content = errorView();
		}

		super(
			{
				meta: {
					title: "Error",
				},
				content,
			},

			{ status },
		);
	}
}
