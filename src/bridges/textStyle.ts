import { TextStyle, type TextStyleOptions } from "@tiptap/extension-text-style";
import { BridgeExtension } from "./base";

interface TextStyleEditorState {}

interface TextStyleEditorInstance {}

declare module "../types/EditorBridge" {
	interface BridgeState extends TextStyleEditorState {}
	interface EditorBridge extends TextStyleEditorInstance {}
}

type TextStyleMessage = never;

const TextStyleBridge = new BridgeExtension<TextStyleEditorState, TextStyleEditorInstance, TextStyleMessage, TextStyleOptions>({
	tiptapExtension: TextStyle,
	onBridgeMessage: () => false,
	extendEditorInstance: () => ({}),
	extendEditorState: () => ({}),
});

export { TextStyleBridge };
