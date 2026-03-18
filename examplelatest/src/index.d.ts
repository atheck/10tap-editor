declare module "*.svg" {
	const content: string;

	// biome-ignore lint/style/noDefaultExport: Required for svg module.
	export default content;
}
