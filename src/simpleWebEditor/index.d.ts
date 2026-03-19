declare global {
	interface Window {
		initialContent: string;
		bridgeExtensionConfigMap: string;
		whiteListBridgeExtensions: string[];
		// biome-ignore lint/style/useNamingConvention: third-party global injected by React Native WebView
		ReactNativeWebView: { postMessage: (message: string) => void };
	}
}

export {};
