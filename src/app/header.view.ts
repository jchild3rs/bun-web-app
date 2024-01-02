import { searchFormView } from "./search/search-form.view";

export function headerView() {
	return `<header class="header">
		<a hx-boost href="/">
			<span>Some Blog</span>
		</a>
		${searchFormView()}
	</header>`;
}
