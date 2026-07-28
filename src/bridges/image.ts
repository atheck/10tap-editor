import { Image, type ImageOptions, type SetImageOptions } from "@tiptap/extension-image";
import { BridgeExtension } from "./base";

type ImageEditorState = Record<string, never>;

interface ImageEditorInstance {
	setImage: (options: SetImageOptions) => void;
}

declare module "../types/EditorBridge" {
	interface EditorBridge extends ImageEditorInstance {}
}

interface ImageMessage {
	type: "set-image";
	payload: SetImageOptions;
}

const ImageEditorActionType = {
	setImage: "set-image",
} as const;

const ImageBridge = new BridgeExtension<ImageEditorState, ImageEditorInstance, ImageMessage, ImageOptions>({
	tiptapExtension: Image.configure({
		allowBase64: true,
	}),
	onBridgeMessage: (editor, message) => {
		if (message.type === ImageEditorActionType.setImage) {
			editor
				.chain()
				.focus()
				.setImage(message.payload)
				.setTextSelection(editor.state.selection.to + 1)
				.run();
		}

		return false;
	},
	extendEditorInstance: (sendBridgeMessage) => ({
		setImage: (options: SetImageOptions) =>
			sendBridgeMessage({
				type: ImageEditorActionType.setImage,
				payload: options,
			}),
	}),
	extendEditorState: () => ({}),
	extendCss: `
  img {
    height: auto;
    max-width: 100%;
  }

  img &.ProseMirror-selectednode {
    outline: 3px solid #68cef8;
  }
  `,
});

export { ImageBridge, ImageEditorActionType };
