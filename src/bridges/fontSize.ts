import { type ChainedCommands, Extension } from "@tiptap/core";
import { TextStyle } from "@tiptap/extension-text-style";
import { BridgeExtension } from "./base";

declare module "@tiptap/core" {
	// biome-ignore lint/style/useNamingConvention: tiptap API requires ReturnType
	interface Commands<ReturnType> {
		fontSize: {
			setFontSize: (fontSize: string) => ReturnType;
			unsetFontSize: () => ReturnType;
		};
	}
}

const FontSize = Extension.create({
	name: "fontSize",

	addOptions() {
		return {
			types: ["textStyle"],
		};
	},

	addGlobalAttributes() {
		return [
			{
				types: this.options.types,
				attributes: {
					fontSize: {
						default: null,
						// biome-ignore lint/style/useNamingConvention: tiptap API name
						parseHTML: (element) => (element as { style: { fontSize: string } }).style.fontSize.replaceAll(/['"]+/gu, ""),
						// biome-ignore lint/style/useNamingConvention: tiptap API name
						renderHTML: (attributes) => {
							if (!attributes.fontSize) {
								return {};
							}

							return { style: `font-size: ${attributes.fontSize}` };
						},
					},
				},
			},
		];
	},

	addCommands() {
		return {
			setFontSize:
				(fontSize: string) =>
				({ chain }: { chain: () => ChainedCommands }) =>
					chain().setMark("textStyle", { fontSize }).run(),
			unsetFontSize:
				() =>
				({ chain }: { chain: () => ChainedCommands }) =>
					chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run(),
		};
	},
});

interface FontSizeEditorState {
	activeFontSize: string | undefined;
}

interface FontSizeEditorInstance {
	setFontSize: (fontSize: string) => void;
	unsetFontSize: () => void;
}

declare module "../types/EditorBridge" {
	interface BridgeState extends FontSizeEditorState {}
	interface EditorBridge extends FontSizeEditorInstance {}
}

type FontSizeMessage =
	| {
			type: "set-font-size";
			payload: string;
	  }
	| {
			type: "unset-font-size";
			payload: undefined;
	  };

const FontSizeEditorActionType = {
	setFontSize: "set-font-size",
	unsetFontSize: "unset-font-size",
} as const;

const FontSizeBridge = new BridgeExtension<FontSizeEditorState, FontSizeEditorInstance, FontSizeMessage>({
	tiptapExtension: FontSize,
	tiptapExtensionDeps: [TextStyle],
	onBridgeMessage: (editor, { type, payload }) => {
		switch (type) {
			case FontSizeEditorActionType.setFontSize:
				editor.chain().focus().setFontSize(payload).run();

				break;
			case FontSizeEditorActionType.unsetFontSize:
				editor.chain().focus().unsetFontSize().run();

				break;
		}

		return false;
	},
	extendEditorInstance: (sendBridgeMessage) => ({
		setFontSize: (fontSize) =>
			sendBridgeMessage({
				type: FontSizeEditorActionType.setFontSize,
				payload: fontSize,
			}),
		unsetFontSize: () =>
			sendBridgeMessage({
				type: FontSizeEditorActionType.unsetFontSize,
				payload: undefined,
			}),
	}),
	extendEditorState: (editor) => ({
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		activeFontSize: editor.getAttributes("textStyle").fontSize,
	}),
});

export { FontSizeBridge, FontSizeEditorActionType };
