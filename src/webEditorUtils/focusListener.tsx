import { isExpo } from "../utils/misc";

// Type guard to check if we're in a browser/webview context
const hasDocument = (): boolean => {
	return (
		// biome-ignore lint/suspicious/noUnnecessaryConditions: Can be true in non-browser environments, i.e. react-native.
		window !== undefined && window.document !== undefined
	);
};

class FocusListener {
	private focus = false;

	public constructor() {
		// Only add event listeners if we're in a webview context where document exists
		if (!hasDocument()) {
			return;
		}

		window.document.addEventListener(
			"focus",
			() => {
				this.focus = true;
			},
			{ capture: true },
		);
		window.document.addEventListener(
			"blur",
			() => {
				this.focus = false;
			},
			{ capture: true },
		);
	}

	public get isFocused(): boolean {
		return this.focus;
	}
}

// Check if we're in a React Native environment (no document) or webview (has document)
// This handles Expo, bare React Native with old/new architecture, and web environments
const isReactNativeContext = isExpo() || !hasDocument();
const shimmedFocusListener = { isFocused: false };

const focusListener = isReactNativeContext ? shimmedFocusListener : new FocusListener();

export { focusListener };
