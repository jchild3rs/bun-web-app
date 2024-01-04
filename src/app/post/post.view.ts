import { User } from "../user/user.types";
import { Photo, Post } from "./post.types";

type PostViewData = {
	photo: Photo;
	post: Post;
	user: User;
};

export function postView({ photo, post, user }: PostViewData) {
	const id = post.id;

	return `<div id="post-${id}" class="post-view content">
			<h1 class="font-serif">
				<a href="/post/${id}">
					${post.title}
				</a>
			</h1>

			<p class="post-author">Written by <a href="/user/${post.userId}">${
				user.name
			}</a></p>
			
			<p>${post.body}</p>

			<img alt="Image" src="${photo.url}" fetchpriority="high" loading="eager" width="600" height="600" />
						
			<blockquote>
			<p>Lorem sit amet, consectetur adipisicing elit. Ex expedita ipsam magni nam vero. Consequuntur dolor earum eveniet ex hic, impedit inventore iure recusandae sapiente tempore ullam vel, voluptatem voluptatibus.</p>
</blockquote>
		
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
