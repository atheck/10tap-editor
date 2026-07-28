import { Heading, type HeadingOptions, type Level } from "@tiptap/extension-heading";
import { BridgeExtension } from "./base";

interface HeadingEditorState {
	headingLevel: number | undefined;
	canToggleHeading: boolean;
}

interface HeadingEditorInstance {
	toggleHeading: (level: Level) => void;
}

declare module "../types/EditorBridge" {
	interface BridgeState extends HeadingEditorState {}
	interface EditorBridge extends HeadingEditorInstance {}
}

interface HeadingMessage {
	type: "toggle-heading";
	payload: Level;
}

const HeadingEditorActionType = {
	toggleHeading: "toggle-heading",
} as const;

const HeadingBridge = new BridgeExtension<HeadingEditorState, HeadingEditorInstance, HeadingMessage, HeadingOptions>({
	tiptapExtension: Heading,
	onBridgeMessage: (editor, message) => {
		if (message.type === HeadingEditorActionType.toggleHeading) {
			editor.chain().focus().toggleHeading({ level: message.payload }).run();
		}

		return false;
	},
	extendEditorInstance: (sendBridgeMessage) => ({
		toggleHeading: (level) =>
			sendBridgeMessage({
				type: HeadingEditorActionType.toggleHeading,
				payload: level,
			}),
	}),
	extendEditorState: (editor) => ({
		canToggleHeading: editor.can().toggleHeading({ level: 1 }),
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		headingLevel: editor.getAttributes("heading").level,
	}),
});

export { HeadingBridge, HeadingEditorActionType };
