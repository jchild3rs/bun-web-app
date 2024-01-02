import { Post } from "../post.types";

export function postListView({
	posts,
	page,
}: { posts: Array<Post>; page: number }) {
	const id = `post-list-${page}`;

	return `<div class="post-list" id="${id}"> 
			<ul>
				${posts
					.map(
						(post) =>
							`<li hx-boost="true"><a href="/post/${post.id}">${post.title}</a></li>`,
					)
					.join("\n\t\t\t\t")}
			</ul>
			<nav>
				<a${
					page > 1
						? `
           hx-swap="outerHTML"
            hx-target="#${id}"
					hx-get="/partial/post-list/${page - 1}" 
					hx-push-url="/?page=${page - 1}" 
					href="/?page=${page - 1}"
				`
						: ""
				}>Previous page</a>
				
				<span>Page ${page}</span>
				
				<a 
	 hx-swap="outerHTML"
          hx-target="#${id}"
					hx-get="/partial/post-list/${page + 1}" 
					hx-push-url="/?page=${page + 1}"
					href="/?page=${page + 1}"
				>
					Next page
				</a>	
			</nav>
		</div>`;
}
