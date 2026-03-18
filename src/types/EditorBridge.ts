import type { RefObject } from "react";
import type { WebView } from "react-native-webview";
import type { BridgeExtension } from "../bridges/base";
import type { Subscription } from "./Subscription";

interface BridgeState {}

interface EditorBridge {
	avoidIosKeyboard?: boolean;
	customSource?: string;
	// biome-ignore lint/style/useNamingConvention: public API uses URL suffix convention
	webviewBaseURL?: string;
	// biome-ignore lint/style/useNamingConvention: public API uses uppercase acronym
	DEV?: boolean;
	// biome-ignore lint/style/useNamingConvention: public API uses uppercase acronym
	DEV_SERVER_URL?: string;
	dynamicHeight?: boolean;
	disableColorHighlight?: boolean;
	autofocus: boolean;
	focus: (pos?: "start" | "end" | "all" | number | boolean | null) => void;
	initialContent?: string | object;
	editable?: boolean;
	webviewRef: RefObject<WebView>;
	getEditorState: () => BridgeState;
	updateEditorState: (state: BridgeState) => void;
	subscribeToEditorStateUpdate: Subscription<BridgeState>;
	onContentUpdate: () => void;
	onContentHeightUpdate: (height: number) => void;
	subscribeToContentUpdate: Subscription<void>;
	bridgeExtensions?: BridgeExtension[];
}

export type { BridgeState, EditorBridge };
