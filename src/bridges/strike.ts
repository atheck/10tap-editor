import { Strike, type StrikeOptions } from "@tiptap/extension-strike";
import { BridgeExtension } from "./base";

interface StrikeEditorState {
	isStrikeActive: boolean;
	canToggleStrike: boolean;
}

interface StrikeEditorInstance {
	toggleStrike: () => void;
}

declare module "../types/EditorBridge" {
	interface BridgeState extends StrikeEditorState {}
	interface EditorBridge extends StrikeEditorInstance {}
}

interface StrikeMessage {
	type: "toggle-strike";
	payload?: undefined;
}

const StrikeEditorActionType = {
	toggleStrike: "toggle-strike",
} as const;

const StrikeBridge = new BridgeExtension<StrikeEditorState, StrikeEditorInstance, StrikeMessage, StrikeOptions>({
	tiptapExtension: Strike,
	onBridgeMessage: (editor, message) => {
		if (message.type === StrikeEditorActionType.toggleStrike) {
			editor.chain().focus().toggleStrike().run();
		}

		return false;
	},
	extendEditorInstance: (sendBridgeMessage) => ({
		toggleStrike: () => sendBridgeMessage({ type: StrikeEditorActionType.toggleStrike }),
	}),
	extendEditorState: (editor) => ({
		canToggleStrike: editor.can().toggleStrike(),
		isStrikeActive: editor.isActive("strike"),
	}),
});

export { StrikeBridge, StrikeEditorActionType };
