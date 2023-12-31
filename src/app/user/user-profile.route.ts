import { Route } from "@lib/router/route";
import { HtmlTemplateResponse } from "@lib/server/html-template-response";

export const userProfileRoute = new Route(
	"/user/:id",
	() =>
		new HtmlTemplateResponse({
			meta: {
				title: "User Profile",
			},
			content: "user profile",
		}),
);
