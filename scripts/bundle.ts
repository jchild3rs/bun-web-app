import fg from "fast-glob";

const log = require("debug")("app:bundle");

type ManifestEntry = {
  path: string;
  name: string;
  kind: string;
  hash: string | null;
  type: string;
};

const OUTPUT_PATH = "./dist";

await Bun.spawn(["rm", "-rf", OUTPUT_PATH]).exited;
log("Removed dist folder");

const fontSourceFonts = ["inter", "fira-code"];

await Bun.spawn(["mkdir", "-p", "./dist/static/fonts"]).exited;

const fontFileDirs = fontSourceFonts.map((font) => {
  return `./node_modules/@fontsource-variable/${font}`;
});

for (const fontFileDir of fontFileDirs) {
  await Bun.spawn(["cp", "-R", fontFileDir, "./dist/static/fonts"]).exited;
}

await Bun.spawn(["bun", "panda"]).exited;
log("Built CSS");

const entrypoints = await fg.glob(
  ["**/client.ts", "**/src/**/client/*.ts", "**/*.client.ts"],
  {
    dot: true,
  }
);

const clientResult = await Bun.build({
  entrypoints,
  outdir: `${OUTPUT_PATH}/static`,
  target: "browser",
  format: "esm",
  splitting: true,
  minify: true,
  naming: "js/[name]-[hash].[ext]",
});
log("Built JS");

if (clientResult.success) {
  // generate manifest
  const manifest: ManifestEntry[] = [];
  const importMap: {
    imports: Record<string, string>;
  } = {
    imports: {},
  };

  for (const output of clientResult.outputs) {
    const foo = output.path.split("/dist/static")[1];
    const bar = foo.replace("/js/", "");
    importMap.imports[bar] = foo;

    manifest.push({
      path: output.path,
      name: output.path.split("/dist")[1],
      kind: output.kind,
      hash: output.hash,
      type: output.type,
    });
  }

  await Bun.write("./dist/importmap.json", JSON.stringify(importMap, null, 2));

  const stylesHash = Bun.hash(
    await Bun.file("./dist/static/styles/styles.css").arrayBuffer()
  );
  const stylesFile = Bun.file("./dist/static/styles/styles.css");
  await Bun.write(`./dist/static/styles/styles-${stylesHash}.css`, stylesFile);

  // remove styles.css
  await Bun.spawn(["rm", "./dist/static/styles/styles.css"]).exited;

  manifest.push({
    name: `styles-${stylesHash}.css`,
  } as ManifestEntry);

  await Bun.write("./dist/manifest.json", JSON.stringify(manifest, null, 2));

  // write manifest to disk
  await Bun.write(
    `${OUTPUT_PATH}/manifest.json`,
    JSON.stringify(manifest, null, 2)
  );
}
log("Built manifest");

await Bun.spawn(["cp", "-R", "./public/", `${OUTPUT_PATH}/static`]).exited;
log("Copied public folder");

const serverResult = await Bun.build({
  entrypoints: ["./src/server.ts"],
  outdir: OUTPUT_PATH,
  target: "bun",
  external: ["sharp"],
});

if (serverResult.success) {
  log("Server built");
} else {
  console.error("Server build failed");
  log(serverResult);
}
