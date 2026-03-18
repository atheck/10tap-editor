import nodeWithBiome from "eslint-config-heck/nodeWithBiome";
import reactNative from "eslint-config-heck/reactNative";

// biome-ignore lint/style/noDefaultExport: Required for ESLint config file.
export default [
	{
		ignores: [
			"eslint.config.mjs",
			"babel.config.js",
			"node_modules/",
			"lib/",
			"lib-web/",
			"**/build/",
			"**/android/build/",
			"**/ios/build/",
			"examplelatest/",
			"website/",
			"src/simpleWebEditor/index.d.ts",
		],
	},
	...nodeWithBiome,
	...reactNative,
	{
		languageOptions: {
			sourceType: "module",
		},
	},
];
