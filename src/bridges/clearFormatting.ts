import { BridgeExtension } from "./base";

interface ClearFormattingEditorState {
	canClearFormatting: boolean;
}

interface ClearFormattingEditorInstance {
	clearFormatting: () => void;
}

declare module "../types/EditorBridge" {
	interface BridgeState extends ClearFormattingEditorState {}
	interface EditorBridge extends ClearFormattingEditorInstance {}
}

interface ClearFormattingMessage {
	type: "clear-formatting";
	payload?: undefined;
}

const ClearFormattingEditorActionType = {
	clearFormatting: "clear-formatting",
} as const;

const ClearFormattingBridge = new BridgeExtension<
	ClearFormattingEditorState,
	ClearFormattingEditorInstance,
	ClearFormattingMessage
>({
	forceName: "clearFormatting",
	onBridgeMessage: (editor, message) => {
		if (message.type === ClearFormattingEditorActionType.clearFormatting) {
			editor.chain().focus().unsetAllMarks().run();
		}

		return false;
	},
	extendEditorInstance: (sendBridgeMessage) => ({
		clearFormatting: () => sendBridgeMessage({ type: ClearFormattingEditorActionType.clearFormatting }),
	}),
	extendEditorState: (editor) => ({
		canClearFormatting: editor.can().unsetAllMarks(),
	}),
});

export { ClearFormattingBridge, ClearFormattingEditorActionType };
