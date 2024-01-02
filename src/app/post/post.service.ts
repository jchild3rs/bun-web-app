import { HttpService } from "@lib/common/http/http.service";
import { type Post } from "./post.types";

class PostService {
	private httpService = new HttpService(
		"https://jsonplaceholder.typicode.com",
	);

	public async all(page = 1) {
		return this.httpService.get<Post[]>(`/posts?_start=${page}&_limit=5`);
	}

	public async byId(id: number) {
		return this.httpService.get<Post>(`/posts/${id}`);
	}

	public async search(query: string) {
		return this.httpService.get<Post[]>(
			`/posts?title_like=^${encodeURIComponent(query)}`,
		);
	}
}

export const postService = new PostService();
