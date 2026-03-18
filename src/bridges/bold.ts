import { Bold, type BoldOptions } from "@tiptap/extension-bold";
import { BridgeExtension } from "./base";

interface BoldEditorState {
	isBoldActive: boolean;
	canToggleBold: boolean;
}

interface BoldEditorInstance {
	toggleBold: () => void;
}

declare module "../types/EditorBridge" {
	interface BridgeState extends BoldEditorState {}
	interface EditorBridge extends BoldEditorInstance {}
}

interface BoldMessage {
	type: "toggle-bold";
	payload?: undefined;
}

const BoldEditorActionType = {
	toggleBold: "toggle-bold",
} as const;

const BoldBridge = new BridgeExtension<BoldEditorState, BoldEditorInstance, BoldMessage, BoldOptions>({
	tiptapExtension: Bold,
	onBridgeMessage: (editor, message) => {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- The only message for now.
		if (message.type === BoldEditorActionType.toggleBold) {
			editor.chain().focus().toggleBold().run();
		}

		return false;
	},
	extendEditorInstance: (sendBridgeMessage) => ({
		toggleBold: () => sendBridgeMessage({ type: BoldEditorActionType.toggleBold }),
	}),
	extendEditorState: (editor) => ({
		canToggleBold: editor.can().toggleBold(),
		isBoldActive: editor.isActive("bold"),
	}),
});

export { BoldBridge, BoldEditorActionType };
