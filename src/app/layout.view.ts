import { headerView } from "@app/header.view";
import { container } from "@styled-system/patterns/container";
import { footerView } from "./footer.view";

export const layoutView = (content: string) =>
	`<div class="${container({
		maxW: "prose",
	})}">
		${headerView()}
		${content}
		${footerView()}
	</div>`;
