import { rsbuildConfig } from "@halo-dev/ui-plugin-bundler-kit";
import Icons from "unplugin-icons/rspack";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const OUT_DIR_PROD = "../src/main/resources/console";
const OUT_DIR_DEV = "../build/resources/main/console";

export default rsbuildConfig({
  rsbuild: ({ envMode }) => {
    const isProduction = envMode === "production";
    const outDir = isProduction ? OUT_DIR_PROD : OUT_DIR_DEV;

    return {
      output: {
        distPath: {
          root: outDir,
        },
        copy: [
          {
            from: resolve(__dirname, "node_modules/mermaid/dist/mermaid.min.js"),
            to: resolve(__dirname, outDir, "../static/"),
          },
        ],
      },
      tools: {
        rspack: {
          plugins: [Icons({ compiler: "vue3" })],
        },
      },
    };
  },
});
