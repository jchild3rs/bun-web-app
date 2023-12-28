import { errorView } from "../views/error.view.ts";
import { HtmlTemplateResponse } from "./html-template-response.ts";

export class ErrorResponse extends HtmlTemplateResponse {
	constructor(error: Error) {
		console.error(error);

		super(
			{
				meta: {
					title: "Error",
				},
				content: errorView(),
			},

			{ status: 500 },
		);
	}
}
