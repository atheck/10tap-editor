import { ListItem, OrderedList, type OrderedListOptions } from "@tiptap/extension-list";
import { BridgeExtension } from "./base";

interface OrderedListEditorState {
	isOrderedListActive: boolean;
	canToggleOrderedList: boolean;
}

interface OrderedListEditorInstance {
	toggleOrderedList: () => void;
}

declare module "../types/EditorBridge" {
	interface BridgeState extends OrderedListEditorState {}
	interface EditorBridge extends OrderedListEditorInstance {}
}

interface OrderedListMessage {
	type: "toggle-orderedList";
	payload?: undefined;
}

const OrderedListEditorActionType = {
	toggleOrderedList: "toggle-orderedList",
} as const;

const OrderedListBridge = new BridgeExtension<
	OrderedListEditorState,
	OrderedListEditorInstance,
	OrderedListMessage,
	OrderedListOptions
>({
	tiptapExtension: OrderedList,
	tiptapExtensionDeps: [ListItem],
	onBridgeMessage: (editor, message) => {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- The only message for now.
		if (message.type === OrderedListEditorActionType.toggleOrderedList) {
			editor.chain().focus().toggleOrderedList().run();
		}

		return false;
	},
	extendEditorInstance: (sendBridgeMessage) => ({
		toggleOrderedList: () =>
			sendBridgeMessage({
				type: OrderedListEditorActionType.toggleOrderedList,
			}),
	}),
	extendEditorState: (editor) => ({
		canToggleOrderedList: editor.can().toggleOrderedList(),
		isOrderedListActive: editor.isActive("orderedList"),
	}),
});

export { OrderedListBridge, OrderedListEditorActionType };
