import { UndoRedo } from "@tiptap/extensions";
import { BridgeExtension } from "./base";

interface HistoryEditorState {
	canUndo: boolean;
	canRedo: boolean;
}

interface HistoryEditorInstance {
	undo: () => void;
	redo: () => void;
}

declare module "../types/EditorBridge" {
	interface BridgeState extends HistoryEditorState {}
	interface EditorBridge extends HistoryEditorInstance {}
}

interface HistoryMessage {
	type: "undo" | "redo";
	payload?: undefined;
}

const HistoryEditorActionType = {
	undo: "undo",
	redo: "redo",
} as const;

const HistoryBridge = new BridgeExtension<HistoryEditorState, HistoryEditorInstance, HistoryMessage>({
	tiptapExtension: UndoRedo,
	onBridgeMessage: (editor, message) => {
		if (message.type === HistoryEditorActionType.undo) {
			editor.chain().focus().undo().run();
		}

		if (message.type === HistoryEditorActionType.redo) {
			editor.chain().focus().redo().run();
		}

		return false;
	},
	extendEditorInstance: (sendBridgeMessage) => {
		const undo = (): void => {
			sendBridgeMessage({ type: HistoryEditorActionType.undo });
		};
		const redo = (): void => {
			sendBridgeMessage({ type: HistoryEditorActionType.redo });
		};

		return {
			redo,
			undo,
		};
	},
	extendEditorState: (editor) => ({
		canUndo: editor.can().undo(),
		canRedo: editor.can().redo(),
	}),
});

export { HistoryBridge, HistoryEditorActionType };
