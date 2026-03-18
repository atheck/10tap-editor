import path from "node:path";
import { getDefaultConfig, mergeConfig } from "@react-native/metro-config";

const root = path.resolve(import.meta.dirname, "..");

const config = {
	watchFolders: [root],
	transformer: {
		getTransformOptions: async () => ({
			transform: {
				experimentalImportSupport: false,
				inlineRequires: true,
			},
		}),
	},
};

// biome-ignore lint/style/noDefaultExport: Required in config file.
export default mergeConfig(getDefaultConfig(import.meta.dirname), config);
