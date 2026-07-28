import { Superscript, type SuperscriptExtensionOptions } from "@tiptap/extension-superscript";
import { BridgeExtension } from "./base";

interface SuperscriptEditorState {
	isSuperscriptActive: boolean;
	canToggleSuperscript: boolean;
}

interface SuperscriptEditorInstance {
	toggleSuperscript: () => void;
}

declare module "../types/EditorBridge" {
	interface BridgeState extends SuperscriptEditorState {}
	interface EditorBridge extends SuperscriptEditorInstance {}
}

interface SuperscriptMessage {
	type: "toggle-superscript";
	payload?: undefined;
}

const SuperscriptEditorActionType = {
	toggleSuperscript: "toggle-superscript",
} as const;

const SuperscriptBridge = new BridgeExtension<
	SuperscriptEditorState,
	SuperscriptEditorInstance,
	SuperscriptMessage,
	SuperscriptExtensionOptions
>({
	tiptapExtension: Superscript,
	onBridgeMessage: (editor, message) => {
		if (message.type === SuperscriptEditorActionType.toggleSuperscript) {
			editor.chain().focus().toggleSuperscript().run();
		}

		return false;
	},
	extendEditorInstance: (sendBridgeMessage) => ({
		toggleSuperscript: () =>
			sendBridgeMessage({
				type: SuperscriptEditorActionType.toggleSuperscript,
			}),
	}),
	extendEditorState: (editor) => ({
		canToggleSuperscript: editor.can().toggleSuperscript(),
		isSuperscriptActive: editor.isActive("superscript"),
	}),
});

export { SuperscriptBridge, SuperscriptEditorActionType };
