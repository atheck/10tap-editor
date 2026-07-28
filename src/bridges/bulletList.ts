import { BulletList, type BulletListOptions, ListItem } from "@tiptap/extension-list";
import { BridgeExtension } from "./base";

interface BulletListEditorState {
	isBulletListActive: boolean;
	canToggleBulletList: boolean;
}

interface BulletListEditorInstance {
	toggleBulletList: () => void;
}

declare module "../types/EditorBridge" {
	interface BridgeState extends BulletListEditorState {}
	interface EditorBridge extends BulletListEditorInstance {}
}

interface BulletListMessage {
	type: "toggle-bulletList";
	payload?: undefined;
}

const BulletListEditorActionType = {
	toggleBulletList: "toggle-bulletList",
} as const;

const BulletListBridge = new BridgeExtension<
	BulletListEditorState,
	BulletListEditorInstance,
	BulletListMessage,
	BulletListOptions
>({
	tiptapExtension: BulletList,
	tiptapExtensionDeps: [ListItem],
	onBridgeMessage: (editor, message) => {
		if (message.type === BulletListEditorActionType.toggleBulletList) {
			editor.chain().focus().toggleBulletList().run();
		}

		return false;
	},
	extendEditorInstance: (sendBridgeMessage) => ({
		toggleBulletList: () =>
			sendBridgeMessage({
				type: BulletListEditorActionType.toggleBulletList,
			}),
	}),
	extendEditorState: (editor) => ({
		canToggleBulletList: editor.can().toggleBulletList(),
		isBulletListActive: editor.isActive("bulletList"),
	}),
});

export { BulletListBridge, BulletListEditorActionType };
