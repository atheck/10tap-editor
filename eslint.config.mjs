import nodeWithBiome from "eslint-config-heck/nodeWithBiome";

// biome-ignore lint/style/noDefaultExport: Required for ESLint config file.
export default [
	{
		ignores: [
			"eslint.config.mjs",
			"babel.config.js",
			"node_modules/",
			"lib/",
			"**/lib-web/",
			"**/build/",
			"**/android/build/",
			"**/ios/build/",
			"src/simpleWebEditor/index.d.ts",
		],
	},
	...nodeWithBiome,
	{
		languageOptions: {
			sourceType: "module",
		},
	},
	{
		rules: {
			"unicorn/consistent-boolean-name": "off",
			"@typescript-eslint/no-unsafe-type-assertion": "off",
		},
	},
];
