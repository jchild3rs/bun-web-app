import { type Post } from "./post.types";

export async function fetchPosts(page = 1) {
	const r = await fetch(
		`https://jsonplaceholder.typicode.com/posts?_start=${page}&_limit=5`,
	);
	return await r.json();
}

export async function fetchPostById(id: number): Promise<Post> {
	const r = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
	return await r.json();
}

export async function searchPosts(query: string): Promise<Post[]> {
	const r = await fetch(
		`https://jsonplaceholder.typicode.com/posts?title_like=^${encodeURIComponent(
			query,
		)}`,
	);
	return await r.json();
}
