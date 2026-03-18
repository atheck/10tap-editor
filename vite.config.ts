import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// biome-ignore lint/style/noDefaultExport: Required for vite config.
export default defineConfig({
	root: "src/simpleWebEditor",
	build: {
		outDir: "build",
		target: "es2015",
	},
	plugins: [react(), viteSingleFile()],
	server: {
		port: 3000,
	},
});
