import { defineConfig, defineGlobalStyles } from "@pandacss/dev";

export default defineConfig({
	globalCss: defineGlobalStyles({
		":root": {
			"--font-fira-code": "Fira Code",
			"--font-inter": "Inter",
		},
		"html, body": {
			color: "gray.900",
			lineHeight: "1.5",
			_dark: {
				color: "white",
				bg: "gray.900",
			},
		},
		body: {
			fontFamily: "body",
		},
		"code, pre": {
			fontFamily: "mono",
		}
	}),
	preflight: true,
	// minify: process.env.NODE_ENV === "production",
	minify: true,
	include: ["./src/**/*.view.ts", "./src/**/*.html"],
	exclude: [],
	outdir: "dist/static/styles",
	theme: {
		extend: {
			tokens: {
				fonts: {
					mono: { value: "var(--font-fira-code), Menlo, monospace" },
					body: { value: "var(--font-inter), var(--font-fallback)" },
				}
			},
		}
	},
});
