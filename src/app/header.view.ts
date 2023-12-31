import { css } from "../../dist/static/styles/css/css";
import { flex } from "../../dist/static/styles/patterns";
import { searchFormView } from "./search/search-form.view";

export function headerView() {
	return `<header class="${flex({
		py: 4,
		align: "center",
		justify: "space-between",
		pos: "sticky",
		top: 0,
		bg: "gray.900",
	})}">
		<a href="/" class="${css({
			fontWeight: "bold",
		})}">
			<span>Some Blog</span>
		</a>
		${searchFormView()}
	</header>`;
}
