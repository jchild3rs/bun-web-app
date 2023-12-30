
const hash = Bun.hash(await Bun.file("./dist/static/styles/styles.css").arrayBuffer())

const file = Bun.file("./dist/static/styles/styles.css");
await Bun.write(`./dist/static/styles/styles-${hash}.css`, file);

const manifest: any[] = JSON.parse(await Bun.file("./dist/manifest.json").text())

manifest.push({
	"styles.css": `styles-${hash}.css`
})

await Bun.write("./dist/manifest.json", JSON.stringify(manifest, null, 2));