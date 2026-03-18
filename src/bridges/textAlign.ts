import { TextAlign, type TextAlignOptions } from "@tiptap/extension-text-align";
import { BridgeExtension } from "./base";

interface TextAlignEditorState {
	activeTextAlign: string | undefined;
	canSetTextAlign: boolean;
}

interface TextAlignEditorInstance {
	setTextAlign: (alignment: "left" | "center" | "right" | "justify") => void;
	unsetTextAlign: () => void;
}

declare module "../types/EditorBridge" {
	interface BridgeState extends TextAlignEditorState {}
	interface EditorBridge extends TextAlignEditorInstance {}
}

interface SetTextAlignMessage {
	type: "set-text-align";
	payload: "left" | "center" | "right" | "justify";
}

interface UnsetTextAlignMessage {
	type: "unset-text-align";
	payload: undefined;
}

type TextAlignMessage = SetTextAlignMessage | UnsetTextAlignMessage;

const TextAlignEditorActionType = {
	setTextAlign: "set-text-align",
	unsetTextAlign: "unset-text-align",
} as const;

const TextAlignBridge = new BridgeExtension<TextAlignEditorState, TextAlignEditorInstance, TextAlignMessage, TextAlignOptions>({
	tiptapExtension: TextAlign.configure({
		types: ["heading", "paragraph"],
		alignments: ["left", "center", "right", "justify"],
	}),
	onBridgeMessage: (editor, { type, payload }) => {
		switch (type) {
			case TextAlignEditorActionType.setTextAlign:
				editor.chain().focus().setTextAlign(payload).run();

				break;
			case TextAlignEditorActionType.unsetTextAlign:
				editor.chain().focus().unsetTextAlign().run();

				break;
		}

		return false;
	},
	extendEditorInstance: (sendBridgeMessage) => ({
		setTextAlign: (alignment) =>
			sendBridgeMessage({
				type: TextAlignEditorActionType.setTextAlign,
				payload: alignment,
			}),
		unsetTextAlign: () =>
			sendBridgeMessage({
				type: TextAlignEditorActionType.unsetTextAlign,
				payload: undefined,
			}),
	}),
	extendEditorState: (editor) => ({
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		activeTextAlign: editor.getAttributes("paragraph").textAlign,
		canSetTextAlign: editor.can().setTextAlign("left"),
	}),
});

export { TextAlignBridge, TextAlignEditorActionType };
