import { HardBreak, type HardBreakOptions } from "@tiptap/extension-hard-break";
import { BridgeExtension } from "./base";

type HardBreakState = Record<string, never>;

interface HardBreakEditorInstance {
	setHardBreak: () => void;
}

declare module "../types/EditorBridge" {
	interface EditorBridge extends HardBreakEditorInstance {}
}

interface HardBreakMessage {
	type: "set-hard-break";
	payload?: undefined;
}

const HardBreakEditorActionType = {
	setHardBreak: "set-hard-break",
} as const;

const HardBreakBridge = new BridgeExtension<HardBreakState, HardBreakEditorInstance, HardBreakMessage, HardBreakOptions>({
	tiptapExtension: HardBreak,
	onBridgeMessage: (editor, message) => {
		if (message.type === HardBreakEditorActionType.setHardBreak) {
			editor.chain().focus().setHardBreak().run();
		}

		return false;
	},
	extendEditorInstance: (sendBridgeMessage) => ({
		setHardBreak: () => sendBridgeMessage({ type: HardBreakEditorActionType.setHardBreak }),
	}),
	extendEditorState: () => ({}),
});

export { HardBreakBridge, HardBreakEditorActionType };
