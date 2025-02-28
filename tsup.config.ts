import { defineConfig } from "tsup";

const args = process.argv;
const entryIndex = args.indexOf("--entry");
const entryFile = entryIndex !== -1 ? args[entryIndex + 1] : "src/index.ts";
const tsconfig = args.indexOf("--tsconfig");
const tsconfigFile = tsconfig !== -1 ? args[tsconfig + 1] : "tsconfig.json";
const watch = args.indexOf("--watch") !== -1;

export default defineConfig([
  // ESM Build → lib/esm
  {
    entry: [entryFile],
    format: ["esm"],
    dts: true,
    sourcemap: true,
    clean: !watch,
    splitting: false,
    minify: false,
    outDir: "lib/esm",
    watch,
    silent: watch,
    esbuildOptions(options) {
      options.outExtension = { ".js": ".js" }; // ✅ Forces .js instead of .mjs
    },
    onSuccess: "echo 'Build completed successfully! 🎉'",
    tsconfig: tsconfigFile
  },

  // CJS Build → lib/cjs
  {
    entry: [entryFile],
    format: ["cjs"],
    dts: true,
    sourcemap: true,
    clean: !watch,
    splitting: false,
    minify: false,
    outDir: "lib/cjs",
    watch,
    silent: watch,
    onSuccess: "echo 'CJS Build completed! ✅'",
    tsconfig: tsconfigFile
  }
]);
