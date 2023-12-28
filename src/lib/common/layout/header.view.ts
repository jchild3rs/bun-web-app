import { searchFormView } from "../../search/search-form.view.ts";

export function headerView() {
	return `<header>header
		${searchFormView()}
			
			</header>`;
}
