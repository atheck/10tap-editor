import { createRoot } from "react-dom/client";
import { AdvancedEditor } from "./AdvancedEditor";

/**
 * This is the entrypoint for the web part of our editor that will be built with vite
 */

declare global {
	interface Window {
		contentInjected: boolean | undefined;
	}
}

/**
 * On android - react-native-webview there is a bug where sometimes the content
 * is injected after the window is loaded https://github.com/react-native-webview/react-native-webview/pull/2960
 * To overcome this we will check if the content is injected before rendering the editor
 */
const contentInjected = (): boolean | undefined => window.contentInjected;

const interval = setInterval(() => {
	if (!contentInjected()) {
		return;
	}

	const container = document.getElementById("root");

	if (container === null) {
		return;
	}

	const root = createRoot(container);

	root.render(<AdvancedEditor />);
	clearInterval(interval);
}, 1);
