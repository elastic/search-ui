import { defineConfig } from "tsup";

const args = process.argv;
const watch = args.indexOf("--watch") !== -1;

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: !watch,
  splitting: false,
  minify: false,
  outDir: "lib",
  watch,
  silent: watch,
  onSuccess: "echo 'Build completed successfully! 🎉'",
  tsconfig: "tsconfig.json"
});
