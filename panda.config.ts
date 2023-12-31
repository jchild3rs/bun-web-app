import { defineConfig, defineGlobalStyles } from "@pandacss/dev";

export default defineConfig({
	globalCss: defineGlobalStyles({
		":root": {
			"--font-fira-code": "Fira Code",
			"--font-inter": "'Inter Variable'",
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
		},
		"a, input, textarea, select, button": {
			_focus: {
				ring: "2px solid",
				ringColor: "blue.500",
				ringOffset: "1",
			}
		}
	}),
	preflight: true,
	// minify: process.env.NODE_ENV === "production",
	minify: true,
	include: ["./src/**/*.view.ts", "./src/lib/client/**/*", "./src/**/*.html"],
	exclude: [],
	outdir: "dist/static/styles",
	theme: {
		extend: {
			tokens: {
				fonts: {
					mono: { value: "var(--font-fira-code), Menlo, monospace" },
					body: { value: "var(--font-inter), var(--font-fallback)" },
				},
			},
		},
	},
	patterns: {
		extend: {
			scrollable: {
				description: 'A container that allows for scrolling',
				properties: {
					// The direction of the scroll
					direction: { type: 'enum', value: ['horizontal', 'vertical'] },
					// Whether to hide the scrollbar
					hideScrollbar: { type: 'boolean' }
				},
				// disallow the `overflow` property (in TypeScript)
				blocklist: ['overflow'],
				transform(props) {
					const { direction, hideScrollbar, ...rest } = props
					return {
						overflow: 'auto',
						height: direction === 'horizontal' ? '100%' : 'auto',
						width: direction === 'vertical' ? '100%' : 'auto',
						scrollbarWidth: hideScrollbar ? 'none' : 'auto',
						WebkitOverflowScrolling: 'touch',
						'&::-webkit-scrollbar': {
							display: hideScrollbar ? 'none' : 'auto'
						},
						...rest
					}
				}
			}
		}
	}
});
