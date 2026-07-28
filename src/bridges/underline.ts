import { Underline, type UnderlineOptions } from "@tiptap/extension-underline";
import { BridgeExtension } from "./base";

interface UnderlineEditorState {
	isUnderlineActive: boolean;
	canToggleUnderline: boolean;
}

interface UnderlineEditorInstance {
	toggleUnderline: () => void;
}

declare module "../types/EditorBridge" {
	interface BridgeState extends UnderlineEditorState {}
	interface EditorBridge extends UnderlineEditorInstance {}
}

interface UnderlineMessage {
	type: "toggle-underline";
	payload?: undefined;
}

const UnderlineEditorActionType = {
	toggleUnderline: "toggle-underline",
} as const;

const UnderlineBridge = new BridgeExtension<UnderlineEditorState, UnderlineEditorInstance, UnderlineMessage, UnderlineOptions>({
	tiptapExtension: Underline,
	onBridgeMessage: (editor, message) => {
		if (message.type === UnderlineEditorActionType.toggleUnderline) {
			editor.chain().focus().toggleUnderline().run();
		}

		return false;
	},
	extendEditorInstance: (sendBridgeMessage) => ({
		toggleUnderline: () => sendBridgeMessage({ type: UnderlineEditorActionType.toggleUnderline }),
	}),
	extendEditorState: (editor) => ({
		canToggleUnderline: editor.can().toggleUnderline(),
		isUnderlineActive: editor.isActive("underline"),
	}),
});

export { UnderlineBridge, UnderlineEditorActionType };
