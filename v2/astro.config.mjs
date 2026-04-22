import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Réplique le resolver figma:asset/ de la v1.
 * Les composants React peuvent garder leurs imports figma:asset/HASH.ext tels quels.
 * Les fichiers sont lus depuis src/assets/ (copiés depuis la v1).
 */
function figmaAssetResolver() {
  return {
    name: "figma-asset-resolver",
    resolveId(id) {
      if (id.startsWith("figma:asset/")) {
        const filename = id.replace("figma:asset/", "");
        return path.resolve(__dirname, "src/assets", filename);
      }
    },
  };
}

export default defineConfig({
  site: "https://julienbourcet.fr",
  integrations: [
    react(),
    sitemap(),
  ],
  vite: {
    plugins: [figmaAssetResolver(), tailwindcss()],
    resolve: {
      alias: { "@": path.resolve(__dirname, "./src") },
    },
  },
  output: "static",
});
