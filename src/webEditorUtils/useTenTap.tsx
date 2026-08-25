import type { Editor } from "@tiptap/core";
import { useEditor } from "@tiptap/react";
import debounce from "lodash/debounce";
import { useEffect, useMemo } from "react";
import type { BridgeExtension } from "../bridges/base";
import { CoreEditorActionType } from "../bridges/core";
import { blueBackgroundPlugin } from "../bridges/HighlightSelection";
import type { BridgeState } from "../types/EditorBridge";
import { type EditorMessage, EditorMessageType } from "../types/Messaging";
import { contentHeightListener } from "./contentHeight";

declare global {
	interface Window {
		initialContent: string;
		editable: string;
		bridgeExtensionConfigMap: string;
		whiteListBridgeExtensions: string[];
		dynamicHeight?: boolean;
		disableColorHighlight?: boolean;
		platform?: "ios" | "android" | "web";
		// biome-ignore lint/style/useNamingConvention: third-party global injected by React Native WebView
		ReactNativeWebView: { postMessage: (message: string) => void };
	}
}

interface UseTenTapArgs {
	// biome-ignore lint/suspicious/noExplicitAny: tiptap options are untyped by design
	tiptapOptions?: Record<string, any>;
	bridges?: BridgeExtension[];
}

const sendMessage = (message: EditorMessage): void => {
	// eslint-disable-next-line unicorn/require-post-message-target-origin, unicorn/no-optional-chaining-on-undeclared-variable
	window.ReactNativeWebView?.postMessage(JSON.stringify(message));
};

function filterExists<TItem>(object: TItem): object is NonNullable<TItem> {
	return object !== null && object !== undefined;
}

// Wrapper for tiptap editor that will add specific mobile functionality and support tentap bridges.
// args:
// tiptapOptions - all the options that tiptap editor accepts
// bridges - array of bridges that will be used to extend the editor
const useTenTap = (options?: UseTenTapArgs): ReturnType<typeof useEditor> => {
	const { tiptapOptions = {}, bridges = [] } = options ?? {};
	const extensionConfigs = useMemo<Record<string, { optionsConfig: unknown; extendConfig: unknown }>>(
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		() => JSON.parse(window.bridgeExtensionConfigMap ?? "{}"),
		[],
	);

	const extensions = bridges
		.map((ext) => {
			const extensionConfig = extensionConfigs[ext.name];

			if (!extensionConfig) {
				return null;
			}

			const { optionsConfig, extendConfig } = extensionConfig;

			return ext.configureTiptapExtensionsOnRunTime(
				optionsConfig as Record<string, unknown>,
				extendConfig as Record<string, unknown>,
			);
		})
		.filter(filterExists)
		.flat();

	const tiptapOptionsWithExtensions = {
		...tiptapOptions,
		extensions: [
			...(window.disableColorHighlight ? [] : [blueBackgroundPlugin]),
			...extensions,
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			...(tiptapOptions.extensions || []),
		],
	};

	const sendStateUpdate = debounce((tiptapEditor: Editor) => {
		const payload = {};

		const state = bridges.reduce((acc, ext) => {
			if (!ext.extendEditorState) {
				return acc;
			}

			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			return Object.assign(acc, ext.extendEditorState(tiptapEditor));
		}, payload) as BridgeState;

		sendMessage({
			type: CoreEditorActionType.stateUpdate,
			payload: state,
		});
	}, 10);

	const content = window.initialContent ?? "";

	const editor = useEditor({
		content,
		onCreate: () =>
			sendMessage({
				type: CoreEditorActionType.editorReady,
				payload: undefined,
			}),
		onUpdate: (onUpdate) => {
			sendStateUpdate(onUpdate.editor);
			sendMessage({
				type: CoreEditorActionType.contentUpdate,
				payload: undefined,
			});
		},
		onSelectionUpdate: (onUpdate) => sendStateUpdate(onUpdate.editor),
		onTransaction: (onUpdate) => sendStateUpdate(onUpdate.editor),
		editable: Boolean(window.editable),
		shouldRerenderOnTransaction: true,
		...tiptapOptionsWithExtensions,
	});

	useEffect(() => {
		if (!editor) {
			return;
		}

		// Subscribe to editor message
		const handleEditorAction = (action: unknown): void => {
			for (const ext of bridges) {
				ext.onBridgeMessage?.(editor, action, sendMessage);
			}
		};

		const handleWebviewMessage = (event: MessageEvent | Event): void => {
			if (!(event instanceof MessageEvent)) {
				// TODO: check android
				return;
			}

			const message = JSON.parse(event.data as string) as EditorMessage;

			if (message.type === EditorMessageType.action) {
				// Workaround for https://github.com/react-native-webview/react-native-webview/issues/3305
				if (message.id) {
					// @ts-expect-error
					if (window.lastMessageID === message.id) {
						return;
					}

					// @ts-expect-error
					// eslint-disable-next-line unicorn/no-global-object-property-assignment
					window.lastMessageID = message.id;
				}

				// Handle actions
				handleEditorAction(message.payload);
			}
		};

		// We need to listen to both window and document events because some platform get
		// webview messages from window and some from document
		window.addEventListener("message", handleWebviewMessage);
		document.addEventListener("message", handleWebviewMessage);

		return () => {
			window.removeEventListener("message", handleWebviewMessage);
			document.removeEventListener("message", handleWebviewMessage);
		};
	}, [editor, bridges]);

	useEffect(() => {
		if (!editor || contentHeightListener.connected || !window.dynamicHeight) {
			return;
		}

		const dynamicHeightDiv = document.querySelector(".dynamic-height");

		// biome-ignore lint/style/noNonNullAssertion: element is guaranteed to exist when dynamicHeight is true
		contentHeightListener.connect(document.querySelector(".ProseMirror")!, (height) => {
			// We need to reset the scroll position to fix a text jumping issue
			// to avoid an issue where text jumps https://github.com/10play/10tap-editor/issues/236 and https://github.com/10play/10tap-editor/issues/244
			if (dynamicHeightDiv) {
				dynamicHeightDiv.scrollTop = 0;
			}

			sendMessage({
				type: CoreEditorActionType.documentHeight,
				payload: height,
			});
		});
	}, [editor]);

	return editor;
};

export { sendMessage, useTenTap };
