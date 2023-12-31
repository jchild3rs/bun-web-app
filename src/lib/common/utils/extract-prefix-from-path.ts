/**
 * @example
 * 	 - path: src/lib/common/this-is-a-prefix.path.foo.ts
 *   - prefix: this-is-a-prefix.path
 * @param {string} path
 */
export function extractPrefixFromPath(path: string): string {
	return path
		.split("/")
		.pop()
		?.split(new RegExp(/-[a-f0-9]{16}/g))
		.shift() as string;
}
