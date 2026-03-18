import { FontFamily, type FontFamilyOptions } from "@tiptap/extension-font-family";
import { TextStyle } from "@tiptap/extension-text-style";
import { BridgeExtension } from "./base";

interface FontFamilyEditorState {
	activeFontFamily: string | undefined;
}

interface FontFamilyEditorInstance {
	setFontFamily: (fontFamily: string) => void;
	unsetFontFamily: () => void;
}

declare module "../types/EditorBridge" {
	interface BridgeState extends FontFamilyEditorState {}
	interface EditorBridge extends FontFamilyEditorInstance {}
}

type FontFamilyMessage =
	| {
			type: "set-font-family";
			payload: string;
	  }
	| {
			type: "unset-font-family";
			payload: undefined;
	  };

const FontFamilyEditorActionType = {
	setFontFamily: "set-font-family",
	unsetFontFamily: "unset-font-family",
} as const;

const FontFamilyBridge = new BridgeExtension<
	FontFamilyEditorState,
	FontFamilyEditorInstance,
	FontFamilyMessage,
	FontFamilyOptions
>({
	tiptapExtension: FontFamily,
	tiptapExtensionDeps: [TextStyle],
	onBridgeMessage: (editor, { type, payload }) => {
		switch (type) {
			case FontFamilyEditorActionType.setFontFamily:
				editor.chain().focus().setFontFamily(payload).run();

				break;
			case FontFamilyEditorActionType.unsetFontFamily:
				editor.chain().focus().unsetFontFamily().run();

				break;
		}

		return false;
	},
	extendEditorInstance: (sendBridgeMessage) => ({
		setFontFamily: (fontFamily) =>
			sendBridgeMessage({
				type: FontFamilyEditorActionType.setFontFamily,
				payload: fontFamily,
			}),
		unsetFontFamily: () =>
			sendBridgeMessage({
				type: FontFamilyEditorActionType.unsetFontFamily,
				payload: undefined,
			}),
	}),
	extendEditorState: (editor) => ({
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		activeFontFamily: editor.getAttributes("textStyle").fontFamily,
	}),
});

export { FontFamilyBridge, FontFamilyEditorActionType };
