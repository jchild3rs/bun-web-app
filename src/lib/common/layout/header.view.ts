import { flex } from "@styled-system/patterns";
import { searchFormView } from "@lib/search/search-form.view";

export function headerView() {
	return `<header class="${flex({
		justify: 'space-between',
		p: 4
	})}">header
		${searchFormView()}
			</header>`;
}
