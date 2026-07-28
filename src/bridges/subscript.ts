import { Subscript, type SubscriptExtensionOptions } from "@tiptap/extension-subscript";
import { BridgeExtension } from "./base";

interface SubscriptEditorState {
	isSubscriptActive: boolean;
	canToggleSubscript: boolean;
}

interface SubscriptEditorInstance {
	toggleSubscript: () => void;
}

declare module "../types/EditorBridge" {
	interface BridgeState extends SubscriptEditorState {}
	interface EditorBridge extends SubscriptEditorInstance {}
}

interface SubscriptMessage {
	type: "toggle-subscript";
	payload?: undefined;
}

const SubscriptEditorActionType = {
	toggleSubscript: "toggle-subscript",
} as const;

const SubscriptBridge = new BridgeExtension<
	SubscriptEditorState,
	SubscriptEditorInstance,
	SubscriptMessage,
	SubscriptExtensionOptions
>({
	tiptapExtension: Subscript,
	onBridgeMessage: (editor, message) => {
		if (message.type === SubscriptEditorActionType.toggleSubscript) {
			editor.chain().focus().toggleSubscript().run();
		}

		return false;
	},
	extendEditorInstance: (sendBridgeMessage) => ({
		toggleSubscript: () => sendBridgeMessage({ type: SubscriptEditorActionType.toggleSubscript }),
	}),
	extendEditorState: (editor) => ({
		canToggleSubscript: editor.can().toggleSubscript(),
		isSubscriptActive: editor.isActive("subscript"),
	}),
});

export { SubscriptBridge, SubscriptEditorActionType };
