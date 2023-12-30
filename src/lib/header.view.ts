import { searchFormView } from "@lib/search/search-form.view";
import { css } from "@styled-system/css/css";
import { flex } from "@styled-system/patterns";

export function headerView() {
	return `<header class="${flex({
		py: 4,
		align: "center",
		justify: "space-between",
	})}">
		<a href="/" class="${css({
			fontWeight: "bold",
		})}">
			<span>Home</span>
		</a>
		${searchFormView()}
	</header>`;
}
