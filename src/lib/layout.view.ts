import { footerView } from "@lib/footer.view";
import { headerView } from "@lib/header.view";
import { container } from "@styled-system/patterns/container";

export const layoutView = (content: string) =>
	`<div class="${container({
		maxW: "prose",
	})}">
		${headerView()}
		${content}
		${footerView()}
	</div>`;
