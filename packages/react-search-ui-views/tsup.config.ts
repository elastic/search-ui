import baseConfig from "../../tsup.config.ts";
import fs from "fs/promises";
import path from "path";
import sass from "sass";
import postcss from "postcss";
import autoprefixer from "autoprefixer";

export default {
  ...baseConfig,
  async onSuccess() {
    /* eslint-disable no-console */
    console.log("🚀 Compiling SCSS...");
    const result = sass.renderSync({
      file: "src/styles/styles.scss",
      outputStyle: "compressed"
    });

    /* eslint-disable no-console */
    console.log("🔄 Processing with PostCSS...");
    const processed = await postcss([autoprefixer]).process(result.css, {
      from: undefined
    });

    const outputPath = path.resolve("lib/styles/styles.css");
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, processed.css);

    /* eslint-disable no-console */
    console.log("✅ Styles compiled to lib/styles/styles.css");
  }
};
