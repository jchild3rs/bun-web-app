import { css } from "@styled-system/css";
import { flex } from "@styled-system/patterns/flex";
import { SystemStyleObject } from "@styled-system/types/system-types";
import { Post } from "../post.types";

const linkStyles: SystemStyleObject = {
	color: "inherit",
	textDecoration: "none",
	fontWeight: "bold",
};

export function postListView(posts: Array<Post>, page: number) {
	const id = `post-list-${page}`;

	return `<div id="${id}" class="post-list">
			<ul>
				${posts
					.map(
						(post) =>
							`<li hx-boost="true"><a href="/post/${post.id}">${post.title}</a></li>`,
					)
					.join("\n\t\t\t\t")}
			</ul>
			<nav class="${flex({
				py: 4,
				justify: "space-between",
			})}">
				<a${
					page > 1
						? `
					hx-swap="outerHTML" 
					hx-get="/partial/post-list/${page - 1}" 
					hx-target="#${id}"
					hx-push-url="/?page=${page - 1}" 
					href="/?page=${page - 1}"
					class="${css(linkStyles)}"
				`
						: ""
				}>Previous page</a>
				
				<span>Page ${page}</span>
				
				<a 
					hx-swap="outerHTML" 
					hx-get="/partial/post-list/${page + 1}" 
					hx-target="#${id}"
					hx-push-url="/?page=${page + 1}"
					href="/?page=${page + 1}"
					class="${css(linkStyles)}"
				>
					Next page
				</a>	
			</nav>
		</div>`;
}
