import { Italic, type ItalicOptions } from "@tiptap/extension-italic";
import { BridgeExtension } from "./base";

interface ItalicEditorState {
	isItalicActive: boolean;
	canToggleItalic: boolean;
}

interface ItalicEditorInstance {
	toggleItalic: () => void;
}

declare module "../types/EditorBridge" {
	interface BridgeState extends ItalicEditorState {}
	interface EditorBridge extends ItalicEditorInstance {}
}

interface ItalicMessage {
	type: "toggle-italic";
	payload?: undefined;
}

const ItalicEditorActionType = {
	toggleItalic: "toggle-italic",
} as const;

const ItalicBridge = new BridgeExtension<ItalicEditorState, ItalicEditorInstance, ItalicMessage, ItalicOptions>({
	tiptapExtension: Italic,
	onBridgeMessage: (editor, message) => {
		if (message.type === ItalicEditorActionType.toggleItalic) {
			editor.chain().focus().toggleItalic().run();
		}

		return false;
	},
	extendEditorInstance: (sendBridgeMessage) => ({
		toggleItalic: () => sendBridgeMessage({ type: ItalicEditorActionType.toggleItalic }),
	}),
	extendEditorState: (editor) => ({
		canToggleItalic: editor.can().toggleItalic(),
		isItalicActive: editor.isActive("italic"),
	}),
});

export { ItalicBridge, ItalicEditorActionType };
