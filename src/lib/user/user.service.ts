import { User } from "./user.types";

export async function fetchUserById(id: number) {
	const user: User = await (
		await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
	).json();

	return user;
}
