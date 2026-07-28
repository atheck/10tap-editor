import cloneDeep from "lodash/cloneDeep";
import { type RefObject, useEffect, useMemo, useRef } from "react";
import { Platform } from "react-native";
import type { WebView } from "react-native-webview";
import type { BridgeExtension } from "../bridges/base";
import { TenTapStartKit } from "../bridges/StarterKit";
import type { EditorBridge, EditorTheme } from "../types";
import type { BridgeState } from "../types/EditorBridge";
import { type EditorActionMessage, EditorMessageType } from "../types/Messaging";
import type { Subscription } from "../types/Subscription";
import { uniqueBy } from "../utils";
import { mergeThemes } from "../utils/mergeThemes";
import { isFabric } from "../utils/misc";
import { EditorHelper } from "./EditorHelper";
import { defaultEditorTheme } from "./theme";
import { getStyleSheetCSS } from "./utils";

type RecursivePartial<TObject> = {
	// biome-ignore lint/style/useNamingConvention: mapped type key P is conventional
	[P in keyof TObject]?: RecursivePartial<TObject[P]>;
};

const useEditorBridge = (options?: {
	bridgeExtensions?: BridgeExtension[];
	initialContent?: string | object;
	autofocus?: boolean;
	avoidIosKeyboard?: boolean;
	customSource?: string;
	// biome-ignore lint/style/useNamingConvention: public API uses URL suffix convention
	webviewBaseURL?: string;
	dynamicHeight?: boolean;
	disableColorHighlight?: boolean;
	editable?: boolean;
	onChange?: () => void;
	// biome-ignore lint/style/useNamingConvention: public API uses uppercase acronym
	DEV?: boolean;
	// biome-ignore lint/style/useNamingConvention: public API uses uppercase acronym
	DEV_SERVER_URL?: string;
	theme?: RecursivePartial<EditorTheme>;
}): EditorBridge => {
	const webviewRef = useRef<WebView>(null);
	// Till we will implement default per bridgeExtension
	const editorStateRef = useRef<BridgeState | Record<string, never>>({});
	const editorStateSubsRef = useRef<((state: BridgeState) => void)[]>([]);
	const editorContentSubsRef = useRef<(() => void)[]>([]);

	const bridgeExtensions = useMemo(() => {
		const extensions = options?.bridgeExtensions ?? TenTapStartKit;

		// Filter out duplicates - the last one wins
		return uniqueBy(extensions, "name");
	}, [options?.bridgeExtensions]);

	const mergedTheme = useMemo(
		// We must deep clone defaultEditorTheme, because it is read only
		() => mergeThemes(cloneDeep(defaultEditorTheme), options?.theme),
		[options?.theme],
	);

	const editable = options?.editable === undefined ? true : options.editable;

	// biome-ignore lint/correctness/useExhaustiveDependencies: editorInstance is intentionally excluded to avoid circular dependency
	useEffect(() => {
		if (!webviewRef.current) {
			return;
		}

		if (options) {
			// Special case for editable prop, since its command is on the core bridge and we want to access it via useEditorBridge
			editorInstance.setEditable(editable);
		}
	}, [editable]);

	const updateEditorState = (editorState: BridgeState): void => {
		editorStateRef.current = editorState;

		for (const sub of editorStateSubsRef.current) {
			sub(editorState);
		}
	};

	const onContentUpdate = (): void => {
		for (const sub of editorContentSubsRef.current) {
			sub();
		}

		options?.onChange?.();
	};

	const subscribeToEditorStateUpdate: Subscription<BridgeState> = (cb) => {
		editorStateSubsRef.current.push(cb);

		return () => {
			editorStateSubsRef.current = editorStateSubsRef.current.filter((sub) => sub !== cb);
		};
	};

	const subscribeToContentUpdate: Subscription<void> = (cb) => {
		editorContentSubsRef.current.push(cb);

		return () => {
			editorContentSubsRef.current = editorContentSubsRef.current.filter((sub) => sub !== cb);
		};
	};

	const getEditorState = (): BridgeState | Record<string, never> => editorStateRef.current;

	const sendMessage = (message: EditorActionMessage): void => {
		if (!webviewRef.current) {
			// biome-ignore lint/suspicious/noConsole: intentional developer warning
			console.warn("Editor isn't ready yet");

			return;
		}

		// Workaround for https://github.com/react-native-webview/react-native-webview/issues/3305
		// On the new arch on Android, messages are sent twice, so if we toggle bold it immediately toggles back
		// We workaround this by adding a random id to the message and not handling it twice on the web side
		if (isFabric() && Platform.OS === "android") {
			message.id = Math.random().toString(36).slice(7);
		}

		// eslint-disable-next-line unicorn/require-post-message-target-origin
		webviewRef.current.postMessage(JSON.stringify(message));
	};

	const sendAction = (action: unknown): void => {
		sendMessage({
			type: EditorMessageType.action,
			payload: action,
		});
	};

	/**
	 * Injects custom css stylesheet, if stylesheet exists with the same tag, it will be replaced
	 * @param cssString css to inject
	 * @param tag optional - tag to identify the style element
	 */
	const injectCss = (cssString: string, tag = "custom-css"): void => {
		// Generate custom stylesheet with `custom-css` tag
		const customCss = getStyleSheetCSS(cssString, tag);

		webviewRef.current?.injectJavaScript(customCss);
	};

	// Disable color highlight on Android if not passed
	// see: https://github.com/10play/10tap-editor/issues/184
	const disableColorHighlight =
		options?.disableColorHighlight === undefined ? Platform.OS === "android" : options.disableColorHighlight;

	const editorBridge = {
		bridgeExtensions,
		initialContent: options?.initialContent,
		autofocus: options?.autofocus,
		dynamicHeight: options?.dynamicHeight,
		disableColorHighlight,
		avoidIosKeyboard: options?.avoidIosKeyboard,
		customSource: options?.customSource,
		editable,
		// biome-ignore lint/style/useNamingConvention: public API uses URL suffix convention
		webviewBaseURL: options?.webviewBaseURL,
		// biome-ignore lint/style/useNamingConvention: public API uses uppercase acronym
		DEV_SERVER_URL: options?.DEV_SERVER_URL,
		// biome-ignore lint/style/useNamingConvention: public API uses uppercase acronym
		DEV: options?.DEV,
		webviewRef,
		theme: mergedTheme,
		getEditorState,
		// biome-ignore lint/style/useNamingConvention: public API uses CSS uppercase convention
		injectCSS: injectCss,
		updateEditorState,
		subscribeToEditorStateUpdate,
		onContentUpdate,
		subscribeToContentUpdate,
	};

	// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
	const editorInstance = bridgeExtensions.reduce((acc, cur) => {
		if (!cur.extendEditorInstance) {
			return acc;
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
		const webviewRefCast = webviewRef as RefObject<WebView>;

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return Object.assign(
			acc,
			// eslint-disable-next-line react/refs -- extendEditorInstance implementations only read `.current` lazily inside closures, not during this render call
			cur.extendEditorInstance(sendAction, webviewRefCast, editorStateRef, updateEditorState, Platform.OS),
			// eslint-disable-next-line react/refs -- the bridge exposes `webviewRef` itself (not a read `.current` value) for consumers to attach to their own WebView ref
			webviewRef,
			// eslint-disable-next-line react/refs -- editorInstance is rebuilt every render, so reading the ref's current value here is required for the bridge to be up to date
			editorStateRef.current,
			updateEditorState,
		);
	}, editorBridge) as EditorBridge;

	EditorHelper.setEditorLastInstance(editorInstance);

	return editorInstance;
};

export type { RecursivePartial };

export { useEditorBridge };
