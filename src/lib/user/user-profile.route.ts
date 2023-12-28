import { Route } from "../common/router/route.ts";
import { HtmlTemplateResponse } from "../common/server/html-template-response.ts";

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
