import { headerView } from "@app/header.view";
import { footerView } from "./footer.view";

export const layoutView = (content: string) => `
		${headerView()}
		${content}
		${footerView()}
`;
