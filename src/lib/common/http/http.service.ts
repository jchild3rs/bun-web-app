export class HttpService {
	constructor(
		private readonly url: string,
		private readonly options?: {
			headers?: Headers;
		},
	) {}

	public async get<T>(path: string, params?: URLSearchParams): Promise<T> {
		const response = await fetch(
			`${this.url}${path}${params ? `?${params.toString()}` : ""}`,
			this.options,
		);

		return await response.json();
	}

	public async post<T, U>(url: string, data: T): Promise<U> {
		const response = await fetch(url, {
			method: "POST",
			body: JSON.stringify(data),
		});
		return await response.json();
	}
}
