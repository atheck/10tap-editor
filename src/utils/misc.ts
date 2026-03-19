// @ts-expect-error
const isFabric = (): boolean => Boolean(global.nativeFabricUIManager);

const isExpo = (): boolean => {
	let isRunningOnExpo = false;

	// Attempt to require the Expo Constants module
	try {
		/* eslint-disable @typescript-eslint/no-unsafe-assignment */
		// biome-ignore lint/correctness/noUndeclaredDependencies: optional peer dependency, detected at runtime
		// biome-ignore lint/style/noCommonJs: dynamic require needed for optional expo detection
		const ExpoConstants = require("expo-constants");
		/* eslint-enable @typescript-eslint/no-unsafe-assignment */

		if (ExpoConstants) {
			isRunningOnExpo = true;
		}
	} catch {
		// If the require call throws an error, we're not in an Expo environment
		isRunningOnExpo = false;
	}

	return isRunningOnExpo;
};

export { isExpo, isFabric };
