import { HttpService } from "@lib/common/http/http.service";
import {Photo, type Post} from "./post.types";

class PostService {
	private httpService = new HttpService(
		"https://jsonplaceholder.typicode.com",
	);

	public async all(page = 1, limit = 6) {
		return this.httpService.get<Post[]>(
			`/posts?_start=${page + limit}&_limit=${limit}`,
		);
	}

	public async byId(id: number) {
		return this.httpService.get<Post>(`/posts/${id}`);
	}

	public async search(query: string) {
		return this.httpService.get<Post[]>(
			`/posts?title_like=^${encodeURIComponent(query)}`,
		);
	}

	async photosByPostId(id: number) {
		return this.httpService.get<Photo>(
			`/photos/${id}`,
		);
	}
}

export const postService = new PostService();
