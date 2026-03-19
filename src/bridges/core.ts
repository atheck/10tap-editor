import { Document } from "@tiptap/extension-document";
// biome-ignore lint/correctness/noUndeclaredDependencies: transitive tiptap dep
import { Paragraph } from "@tiptap/extension-paragraph";
// biome-ignore lint/correctness/noUndeclaredDependencies: transitive tiptap dep
import { Text } from "@tiptap/extension-text";
import type { Content } from "@tiptap/react";
import { asyncMessages } from "../RichText/AsyncMessages";
import type { BridgeState, EditorTheme } from "../types";
import { focusListener } from "../webEditorUtils/focusListener";
import { BridgeExtension } from "./base";

interface CoreEditorState {
	selection: { from: number; to: number };
	isFocused: boolean;
	isReady: boolean;
	editable: boolean;
	empty: boolean;
}

type FocusArgs = "start" | "end" | "all" | number | boolean | null;

interface CoreEditorInstance {
	// biome-ignore lint/style/useNamingConvention: public API method name
	getHTML: () => Promise<string>;
	// biome-ignore lint/style/useNamingConvention: public API method name
	getJSON: () => Promise<object>;
	getText: () => Promise<string>;
	setContent: (content: Content) => void;
	setSelection: (from: number, to: number) => void;
	updateScrollThresholdAndMargin: (offset: number) => void;
	focus: (pos: FocusArgs) => void;
	blur: () => void;
	// biome-ignore lint/style/useNamingConvention: public API method name
	injectJS: (js: string) => void;
	// biome-ignore lint/style/useNamingConvention: public API method name
	injectCSS: (css: string, tag?: string) => void;
	setEditable: (editable: boolean) => void;
	theme: EditorTheme;
}

declare module "../types/EditorBridge" {
	// biome-ignore lint/nursery/noShadow: intentional module augmentation pattern
	interface BridgeState extends CoreEditorState {}
	interface EditorBridge extends CoreEditorInstance {}
}

type MessageToNative =
	| {
			type: "send-html-back";
			payload: {
				content: string;
				messageId: string;
			};
	  }
	| {
			type: "send-text-back";
			payload: {
				content: string;
				messageId: string;
			};
	  }
	| {
			type: "send-json-back";
			payload: {
				content: object;
				messageId: string;
			};
	  };

type CoreMessages =
	| MessageToNative
	| {
			type: "get-html";
			payload: {
				messageId: string;
			};
	  }
	| {
			type: "get-json";
			payload: {
				messageId: string;
			};
	  }
	| {
			type: "get-text";
			payload: {
				messageId: string;
			};
	  }
	| {
			type: "set-content";
			payload: {
				content: Content;
			};
	  }
	| {
			type: "stateUpdate";
			payload: BridgeState;
	  }
	| {
			type: "editor-ready";
			payload: undefined;
	  }
	| {
			type: "focus";
			payload: FocusArgs;
	  }
	| {
			type: "blur";
			payload: undefined;
	  }
	| {
			type: "update-scroll-threshold-and-margin";
			payload: number;
	  }
	| {
			type: "set-selection";
			payload: {
				from: number;
				to: number;
			};
	  }
	| {
			type: "content-update";
			payload: undefined;
	  }
	| {
			type: "document-height";
			payload: number;
	  }
	| {
			type: "set-editable";
			payload: boolean;
	  };

type EditorContentType = "html" | "text" | "json";

const CoreEditorActionType = {
	setSelection: "set-selection",
	// biome-ignore lint/style/useNamingConvention: public API method name
	getHTML: "get-html",
	// biome-ignore lint/style/useNamingConvention: public API method name
	getJSON: "get-json",
	getText: "get-text",
	// biome-ignore lint/style/useNamingConvention: public API method name
	sendHTMLToNative: "send-html-back",
	sendTextToNative: "send-text-back",
	// biome-ignore lint/style/useNamingConvention: public API method name
	sendJSONToNative: "send-json-back",
	setContent: "set-content",
	stateUpdate: "stateUpdate",
	focus: "focus",
	blur: "blur",
	editorReady: "editor-ready",
	updateScrollThresholdAndMargin: "update-scroll-threshold-and-margin",
	contentUpdate: "content-update",
	documentHeight: "document-height",
	setEditable: "set-editable",
} as const;

const CoreBridge = new BridgeExtension<CoreEditorState, Omit<CoreEditorInstance, "theme" | "injectCSS">, CoreMessages>({
	forceName: "coreBridge",
	tiptapExtension: Document,
	tiptapExtensionDeps: [Paragraph, Text],
	onBridgeMessage: (editor, message, sendMessageBack) => {
		if (message.type === CoreEditorActionType.setContent) {
			editor.commands.setContent(message.payload.content);

			return true;
		}

		if (message.type === CoreEditorActionType.getHTML) {
			sendMessageBack({
				type: CoreEditorActionType.sendHTMLToNative,
				payload: {
					content: editor.getHTML(),
					messageId: message.payload.messageId,
				},
			});
		}

		if (message.type === CoreEditorActionType.getJSON) {
			sendMessageBack({
				type: CoreEditorActionType.sendJSONToNative,
				payload: {
					content: editor.getJSON(),
					messageId: message.payload.messageId,
				},
			});
		}

		if (message.type === CoreEditorActionType.getText) {
			sendMessageBack({
				type: CoreEditorActionType.sendTextToNative,
				payload: {
					content: editor.getText(),
					messageId: message.payload.messageId,
				},
			});
		}

		if (message.type === CoreEditorActionType.setSelection) {
			editor.commands.setTextSelection({
				from: message.payload.from,
				to: message.payload.to,
			});

			return true;
		}

		if (message.type === CoreEditorActionType.focus) {
			editor.commands.focus(message.payload);

			return true;
		}

		if (message.type === CoreEditorActionType.blur) {
			editor.commands.blur();

			return true;
		}

		if (message.type === CoreEditorActionType.updateScrollThresholdAndMargin) {
			editor.setOptions({
				editorProps: {
					scrollThreshold: {
						top: 0,
						bottom: message.payload,
						right: 0,
						left: 0,
					},
					scrollMargin: { top: 0, bottom: message.payload, right: 0, left: 0 },
				},
			});

			return true;
		}

		if (message.type === CoreEditorActionType.setEditable) {
			editor.setEditable(message.payload);

			return true;
		}

		return false;
	},
	onEditorMessage: ({ type, payload }, editorBridge) => {
		if (type === CoreEditorActionType.sendHTMLToNative) {
			asyncMessages.onMessage(payload.messageId, payload.content);

			return true;
		}

		if (type === CoreEditorActionType.sendTextToNative) {
			asyncMessages.onMessage(payload.messageId, payload.content);

			return true;
		}

		if (type === CoreEditorActionType.sendJSONToNative) {
			asyncMessages.onMessage(payload.messageId, payload.content);

			return true;
		}

		if (type === CoreEditorActionType.editorReady && editorBridge.autofocus) {
			editorBridge.focus("end");
		}

		if (type === CoreEditorActionType.stateUpdate) {
			editorBridge.updateEditorState(payload);
		}

		if (type === CoreEditorActionType.contentUpdate) {
			editorBridge.onContentUpdate();
		}

		return false;
	},
	extendEditorInstance: (sendBridgeMessage, webviewRef, editorStateRef, updateEditorState, platform) => {
		return {
			updateScrollThresholdAndMargin: (bottom: number) =>
				sendBridgeMessage({
					type: CoreEditorActionType.updateScrollThresholdAndMargin,
					payload: bottom,
				}),
			setSelection: (from, to) => {
				sendBridgeMessage({
					type: CoreEditorActionType.setSelection,
					payload: {
						from,
						to,
					},
				});
			},
			setContent: (content: Content) => {
				sendBridgeMessage({
					type: CoreEditorActionType.setContent,
					payload: {
						content,
					},
				});
			},
			// biome-ignore lint/style/useNamingConvention: public API method name
			getHTML: async () => {
				const html = await asyncMessages.sendAsyncMessage<string>(
					{
						type: CoreEditorActionType.getHTML,
					},
					// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
					(msg) => sendBridgeMessage(msg as CoreMessages),
				);

				return html;
			},
			getText: async () => {
				const text = await asyncMessages.sendAsyncMessage<string>(
					{
						type: CoreEditorActionType.getText,
					},
					// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
					(msg) => sendBridgeMessage(msg as CoreMessages),
				);

				return text;
			},
			// biome-ignore lint/style/useNamingConvention: public API method name
			getJSON: async () => {
				const json = await asyncMessages.sendAsyncMessage<object>(
					{
						type: CoreEditorActionType.getJSON,
					},
					// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
					(msg) => sendBridgeMessage(msg as CoreMessages),
				);

				return json;
			},
			focus: (pos: FocusArgs) => {
				if (platform === "android") {
					setTimeout(() => {
						// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
						webviewRef?.current?.requestFocus();
						// Adding this for android, there is a race where the focus is not set if it's too close to Load
						// https://github.com/react-native-webview/react-native-webview/issues/1172
					}, 100);
				} else {
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					webviewRef?.current?.requestFocus();
				}

				if (editorStateRef?.current) {
					updateEditorState?.({
						// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
						...(editorStateRef.current as BridgeState),
						isFocused: true,
					});
				}

				sendBridgeMessage({
					type: CoreEditorActionType.focus,
					payload: pos,
				});
			},
			blur: () => {
				sendBridgeMessage({
					type: CoreEditorActionType.blur,
					payload: undefined,
				});
			},
			// biome-ignore lint/style/useNamingConvention: public API method name
			injectJS: (js: string) => {
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				webviewRef?.current?.injectJavaScript(js);
			},
			setEditable: (editable: boolean) => {
				sendBridgeMessage({
					type: CoreEditorActionType.setEditable,
					payload: editable,
				});
			},
		};
	},
	extendEditorState: (editor) => ({
		isFocused: focusListener.isFocused,
		isReady: true,
		selection: {
			from: editor.state.selection.from,
			to: editor.state.selection.to,
		},
		editable: editor.isEditable,
		empty: editor.isEmpty,
	}),
	extendCss: `
  p {
    margin-block-start: 0;
    margin-block-end: 0;
  }`,
});

export { CoreBridge, CoreEditorActionType, type CoreMessages, type EditorContentType };
