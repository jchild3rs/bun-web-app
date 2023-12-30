import { css } from "@styled-system/css";

export const searchFormView = () => {
	return `<form class="search-form" action="/search" novalidate>
			<input type="text" name="query" class="${css({
				color: "neutral.700",
			})}" placeholder="Search" required>
			<button type="submit">Search</button>
	</form>
	`;
};
