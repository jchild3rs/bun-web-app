import { User } from "../user/user.types";
import { Post } from "./post.types";

type PostViewData = {
	post: Post;
	user: User;
};

export function postView({ post, user }: PostViewData) {
	const id = post.id;

	return `<div id="post-${id}" class="post-view">
			<a href="/post/${id}">
				<h1>${post.title}</h1>
			</a>

			<img alt="Image" src="https://picsum.photos/600" fetchpriority="high" loading="eager" width="600" height="600" />
			
			<p class="post-author">Written by <a href="/user/${post.userId}">${
				user.name
			}</a></p>
			
			<p>${post.body}</p>
			
			<blockquote>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex expedita ipsam magni nam vero. Consequuntur dolor earum eveniet ex hic, impedit inventore iure recusandae sapiente tempore ullam vel, voluptatem voluptatibus.</blockquote>
		
			<nav>
				<a${
					id === 1
						? ""
						: ` 
					hx-get="/partial/post/${id - 1}" 
					hx-swap="outerHTML show:window:top"
					hx-target="#post-${id}" 
					hx-push-url="/post/${id - 1}"
					href="/post/${id - 1}"`
				}>
					Previous Post
				</a>
				
				<a
					hx-get="/partial/post/${id + 1}" 
					hx-swap="outerHTML show:window:top"
					hx-target="#post-${id}" 
					hx-push-url="/post/${id + 1}"
					href="/post/${id + 1}"
				>
					Next Post
				</a>
			</nav>
		</div>`;
}
