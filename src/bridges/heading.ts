import { Heading, type HeadingOptions, type Level } from "@tiptap/extension-heading";
import { BridgeExtension } from "./base";

interface HeadingEditorState {
	headingLevel: Level | undefined;
	canToggleHeading: boolean;
}

interface HeadingEditorInstance {
	toggleHeading: (level: Level) => void;
	resetHeading: () => void;
}

declare module "../types/EditorBridge" {
	interface BridgeState extends HeadingEditorState {}
	interface EditorBridge extends HeadingEditorInstance {}
}

type HeadingMessage =
	| {
			type: "toggle-heading";
			payload: Level;
	  }
	| { type: "reset-heading" };

const HeadingEditorActionType = {
	toggleHeading: "toggle-heading",
	resetHeading: "reset-heading",
} as const;

const HeadingBridge = new BridgeExtension<HeadingEditorState, HeadingEditorInstance, HeadingMessage, HeadingOptions>({
	tiptapExtension: Heading,
	onBridgeMessage: (editor, message) => {
		switch (message.type) {
			case "toggle-heading":
				editor.chain().focus().toggleHeading({ level: message.payload }).run();
				break;

			case "reset-heading":
				editor.chain().focus().setParagraph().run();
				break;
		}

		return false;
	},
	extendEditorInstance: (sendBridgeMessage) => ({
		toggleHeading: (level) =>
			sendBridgeMessage({
				type: HeadingEditorActionType.toggleHeading,
				payload: level,
			}),
		resetHeading: () => sendBridgeMessage({ type: HeadingEditorActionType.resetHeading }),
	}),
	extendEditorState: (editor) => ({
		canToggleHeading: editor.can().toggleHeading({ level: 1 }),
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		headingLevel: editor.getAttributes("heading").level,
	}),
});

export type { Level as HeadingLevel } from "@tiptap/extension-heading";

export { HeadingBridge, HeadingEditorActionType };
