import { ListItem, type ListItemOptions } from "@tiptap/extension-list";
import { BridgeExtension } from "./base";

interface ListItemEditorState {
	canLift: boolean;
	canSink: boolean;
}

interface ListItemEditorInstance {
	lift: () => void;
	sink: () => void;
}

declare module "../types/EditorBridge" {
	interface BridgeState extends ListItemEditorState {}
	interface EditorBridge extends ListItemEditorInstance {}
}

// Actions with no payload
type ToggleActionTypes = "lift" | "sink";

interface ListItemMessage {
	type: ToggleActionTypes;
	payload?: undefined;
}

const ListItemEditorActionType = {
	lift: "lift",
	sink: "sink",
} as const;

const ListItemBridge = new BridgeExtension<ListItemEditorState, ListItemEditorInstance, ListItemMessage, ListItemOptions>({
	tiptapExtension: ListItem,
	onBridgeMessage: (editor, message) => {
		switch (message.type) {
			case ListItemEditorActionType.lift:
				// biome-ignore lint/style/noNonNullAssertion: listItem node is guaranteed to exist when this bridge is active
				editor.chain().focus().liftListItem(editor.schema.nodes.listItem!.name).run();
				break;
			case ListItemEditorActionType.sink:
				// biome-ignore lint/style/noNonNullAssertion: listItem node is guaranteed to exist when this bridge is active
				editor.chain().focus().sinkListItem(editor.schema.nodes.listItem!.name).run();
				break;
		}

		return false;
	},
	extendEditorInstance: (sendBridgeMessage) => {
		const lift = (): void => {
			sendBridgeMessage({ type: ListItemEditorActionType.lift });
		};
		const sink = (): void => {
			sendBridgeMessage({ type: ListItemEditorActionType.sink });
		};

		return {
			lift,
			sink,
		};
	},
	extendEditorState: (editor) => ({
		// biome-ignore lint/style/noNonNullAssertion: listItem node is guaranteed to exist when this bridge is active
		canLift: editor.can().liftListItem(editor.state.schema.nodes.listItem!.name),
		// biome-ignore lint/style/noNonNullAssertion: listItem node is guaranteed to exist when this bridge is active
		canSink: editor.can().sinkListItem(editor.state.schema.nodes.listItem!.name),
	}),
});

export { ListItemBridge, ListItemEditorActionType, type ListItemMessage };
