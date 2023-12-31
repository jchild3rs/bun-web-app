import { join } from "node:path";
export const DIST_PATH = join(
	process.cwd(),
	process.env.NODE_ENV === "production" ? "." : "./dist",
);
