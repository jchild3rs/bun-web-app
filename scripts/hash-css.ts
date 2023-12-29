
const hash = Bun.hash(await Bun.file("./dist/static/styled-system/styles.css").arrayBuffer())

const file = Bun.file("./dist/static/styled-system/styles.css");
await Bun.write(`./dist/static/styled-system/styles-${hash}.css`, file);

const manifest: any[] = JSON.parse(await Bun.file("./dist/manifest.json").text())

manifest.push({
	"styles.css": `styles-${hash}.css`
})

await Bun.write("./dist/manifest.json", JSON.stringify(manifest, null, 2));