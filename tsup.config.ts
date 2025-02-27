import { defineConfig } from "tsup";

const args = process.argv;
const entryIndex = args.indexOf("--entry");
const entryFile = entryIndex !== -1 ? args[entryIndex + 1] : "src/index.ts";
const tsconfig = args.indexOf("--tsconfig");
const tsconfigFile = tsconfig !== -1 ? args[tsconfig + 1] : "tsconfig.json";

export default defineConfig([
  // ESM Build → lib/esm
  {
    entry: [entryFile],
    format: ["esm"],
    dts: true,
    sourcemap: true,
    clean: true,
    splitting: false,
    minify: false,
    outDir: "lib/esm",
    // silent: true,
    esbuildOptions(options) {
      options.outExtension = { ".js": ".js" }; // ✅ Forces .js instead of .mjs
    },
    onSuccess: "echo 'Build completed successfully! 🎉'",
    tsconfig: tsconfigFile,
  },

  // CJS Build → lib/cjs
  {
    entry: [entryFile],
    format: ["cjs"],
    dts: true, // No need to generate types again
    sourcemap: true,
    clean: true,
    splitting: false,
    minify: false,
    outDir: "lib/cjs",
    // silent: true,
    onSuccess: "echo 'CJS Build completed! ✅'",
    tsconfig: tsconfigFile,
  }
]);