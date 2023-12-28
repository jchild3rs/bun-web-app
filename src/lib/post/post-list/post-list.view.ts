import { Post } from "../post.types.ts";

export function postListView(posts: Array<Post>, page: number) {
	const id = `post-list-${page}`;

	return `<div id="${id}" class="post-list">
		<ul>
			${posts
				.map((post) => `<li><a href="/post/${post.id}">${post.title}</a></li>`)
				.join("\n\t\t")}
		</ul>
		<nav>
			<a${
				page > 1
					? `
				hx-swap="outerHTML" 
				hx-get="/partial/post-list/${page - 1}" 
				hx-target="#${id}"
			  hx-push-url="/?page=${page - 1}" 
				href="/?page=${page - 1}"
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
			>
				Next page
			</a>	
		</nav>
	</div>
`;
}
