export const linkView = (props: {
	href: string;
	children: string;
}) => {
	return `<a href="${props.href}">${props.children}</a>`;
}