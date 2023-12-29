import { Route } from "../common/router/route";
import { HtmlTemplateResponse } from "../common/server/html-template-response";

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
