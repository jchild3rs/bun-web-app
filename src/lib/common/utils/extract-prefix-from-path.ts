/**
 * @example
 * 	 - path: src/lib/common/this-is-a-prefix.path.foo.ts
 *   - prefix: get-prefix-from
 * @param {string} path
 */
export function extractPrefixFromPath(path: string): string {
	return path.split("/").pop()?.split(".").shift() as string;
}
