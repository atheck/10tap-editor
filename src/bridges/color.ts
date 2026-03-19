import { Color, type ColorOptions } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { BridgeExtension } from "./base";

interface ColorEditorState {
	activeColor: string | undefined;
}

interface ColorEditorInstance {
	setColor: (color: string) => void;
	unsetColor: () => void;
}

declare module "../types/EditorBridge" {
	interface BridgeState extends ColorEditorState {}
	interface EditorBridge extends ColorEditorInstance {}
}

interface SetColorMessage {
	type: "set-color";
	payload: string;
}
interface UnsetColorMessage {
	type: "unset-color";
	payload: undefined;
}

type ColorMessage = SetColorMessage | UnsetColorMessage;

const ColorEditorActionType = {
	setColor: "set-color",
	unsetColor: "unset-color",
} as const;

const ColorBridge = new BridgeExtension<ColorEditorState, ColorEditorInstance, ColorMessage, ColorOptions>({
	tiptapExtension: Color,
	tiptapExtensionDeps: [TextStyle],
	onBridgeMessage: (editor, { type, payload }) => {
		switch (type) {
			case ColorEditorActionType.setColor:
				editor.chain().focus().setColor(payload).run();

				break;
			case ColorEditorActionType.unsetColor:
				editor.chain().focus().unsetColor().run();

				break;
		}

		return false;
	},
	extendEditorInstance: (sendBridgeMessage) => ({
		setColor: (color) =>
			sendBridgeMessage({
				type: ColorEditorActionType.setColor,
				payload: color,
			}),
		unsetColor: () =>
			sendBridgeMessage({
				type: ColorEditorActionType.unsetColor,
				payload: undefined,
			}),
	}),
	extendEditorState: (editor) => ({
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		activeColor: editor.getAttributes("textStyle").color,
	}),
});

export { ColorBridge, ColorEditorActionType };
