import path from "node:path";
import { defineConfig } from "vite";

// This config is used to build the web editor into a single file

// biome-ignore lint/style/noDefaultExport: Config file export.
export default defineConfig({
	build: {
		lib: {
			// Could also be a dictionary or array of multiple entry points
			entry: path.resolve(import.meta.dirname, "./index.ts"),
			name: "tentapWebutils",
			// the proper extensions will be added
			fileName: "index",
		},
		rollupOptions: {
			// make sure to externalize deps that shouldn't be bundled
			// into your library
			external: ["react", "react/jsx-runtime", "react-dom"],
			output: {
				dir: "lib-web",
				// Provide global variables to use in the UMD build
				// for externalized deps
				globals: {
					react: "React",
				},
			},
		},
	},
});
