const log = require("debug")("app:bundle");

const serverResult = await Bun.build({
  entrypoints: ["./src/server.ts"],
  outdir: "./dist",
  target: "bun",
  external: [],
});

if (serverResult.success) {
  log("Server built");
} else {
  console.error("Server build failed");
  log(serverResult);
}
