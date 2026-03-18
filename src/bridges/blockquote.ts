import { Blockquote, type BlockquoteOptions } from "@tiptap/extension-blockquote";
import { BridgeExtension } from "./base";

interface BlockquoteEditorState {
	isBlockquoteActive: boolean;
	canToggleBlockquote: boolean;
}

interface BlockquoteEditorInstance {
	toggleBlockquote: () => void;
}

declare module "../types/EditorBridge" {
	interface BridgeState extends BlockquoteEditorState {}
	interface EditorBridge extends BlockquoteEditorInstance {}
}

interface BlockquoteMessage {
	type: "toggle-blockquote";
	payload?: undefined;
}

const BlockquoteEditorActionType = {
	toggleBlockquote: "toggle-blockquote",
} as const;

const BlockquoteBridge = new BridgeExtension<
	BlockquoteEditorState,
	BlockquoteEditorInstance,
	BlockquoteMessage,
	BlockquoteOptions
>({
	tiptapExtension: Blockquote,
	onBridgeMessage: (editor, message) => {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- The only message for now.
		if (message.type === BlockquoteEditorActionType.toggleBlockquote) {
			editor.chain().focus().toggleBlockquote().run();
		}

		return false;
	},
	extendEditorInstance: (sendBridgeMessage) => ({
		toggleBlockquote: () =>
			sendBridgeMessage({
				type: BlockquoteEditorActionType.toggleBlockquote,
			}),
	}),
	extendEditorState: (editor) => ({
		canToggleBlockquote: editor.can().toggleBlockquote(),
		isBlockquoteActive: editor.isActive("blockquote"),
	}),
	extendCss: `
    blockquote {
        border-left: 3px solid #0d0d0d1a;
        padding-left: 1rem;
    }
  `,
});

export { BlockquoteBridge, BlockquoteEditorActionType };
