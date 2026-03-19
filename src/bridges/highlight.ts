import { Highlight, type HighlightOptions } from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import { BridgeExtension } from "./base";

interface HighlightEditorState {
	activeHighlight: string | undefined;
}

interface HighlightEditorInstance {
	setHighlight: (color: string) => void;
	toggleHighlight: (color: string) => void;
	unsetHighlight: () => void;
}

declare module "../types/EditorBridge" {
	interface BridgeState extends HighlightEditorState {}
	interface EditorBridge extends HighlightEditorInstance {}
}

interface SetHighlightMessage {
	type: "set-highlight";
	payload: string;
}
interface ToggleHighlightMessage {
	type: "toggle-highlight";
	payload: string;
}
interface UnsetHighlightMessage {
	type: "unset-highlight";
	payload: undefined;
}

type HighlightMessage = SetHighlightMessage | ToggleHighlightMessage | UnsetHighlightMessage;

const HighlightEditorActionType = {
	setHighlight: "set-highlight",
	toggleHighlight: "toggle-highlight",
	unsetHighlight: "unset-highlight",
} as const;

const HighlightBridge = new BridgeExtension<HighlightEditorState, HighlightEditorInstance, HighlightMessage, HighlightOptions>({
	tiptapExtension: Highlight.configure({ multicolor: true }),
	tiptapExtensionDeps: [TextStyle],
	onBridgeMessage: (editor, { type, payload }) => {
		switch (type) {
			case HighlightEditorActionType.setHighlight:
				editor.chain().focus().setHighlight({ color: payload }).run();

				break;
			case HighlightEditorActionType.toggleHighlight:
				editor.chain().focus().toggleHighlight({ color: payload }).run();

				break;
			case HighlightEditorActionType.unsetHighlight:
				editor.chain().focus().unsetHighlight().run();

				break;
		}

		return false;
	},
	extendEditorInstance: (sendBridgeMessage) => ({
		setHighlight: (color) =>
			sendBridgeMessage({
				type: HighlightEditorActionType.setHighlight,
				payload: color,
			}),
		toggleHighlight: (color) =>
			sendBridgeMessage({
				type: HighlightEditorActionType.toggleHighlight,
				payload: color,
			}),
		unsetHighlight: () =>
			sendBridgeMessage({
				type: HighlightEditorActionType.unsetHighlight,
				payload: undefined,
			}),
	}),
	extendEditorState: (editor) => ({
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		activeHighlight: editor.getAttributes("highlight").color,
	}),
});

export { HighlightBridge, HighlightEditorActionType };
