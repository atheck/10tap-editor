import { Placeholder } from "@tiptap/extensions";
import { BridgeExtension } from "./base";

type PlaceholderEditorState = Record<string, never>;

interface PlaceholderEditorInstance {
	setPlaceholder: (newPlaceholder: string) => void;
}

declare module "../types/EditorBridge" {
	interface EditorBridge extends PlaceholderEditorInstance {}
}

interface PlaceholderMessage {
	type: "set-placeholder";
	payload: string;
}

const PlaceholderEditorActionType = {
	setPlaceholder: "set-placeholder",
} as const;

const PlaceholderBridge = new BridgeExtension<PlaceholderEditorState, PlaceholderEditorInstance, PlaceholderMessage>({
	tiptapExtension: Placeholder,
	extendCss: `
    .is-editor-empty:first-child::before {
        color: #adb5bd;
        content: attr(data-placeholder);
        float: left;
        height: 0;
        pointer-events: none;
    }
  `,
	onBridgeMessage: (editor, message) => {
		switch (message.type) {
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- The only message for now.
			case PlaceholderEditorActionType.setPlaceholder: {
				const currentExtensions = editor.extensionManager.extensions;

				for (const extension of currentExtensions) {
					if (extension.name === "placeholder") {
						// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
						extension.options.placeholder = message.payload;
					}
				}

				// TODO: find better way to update the editor
				editor.setOptions();
				break;
			}
		}

		return false;
	},
	extendEditorInstance: (sendBridgeMessage) => {
		const setPlaceholder = (newPlaceholder: string): void => {
			sendBridgeMessage({
				type: PlaceholderEditorActionType.setPlaceholder,
				payload: newPlaceholder,
			});
		};

		return {
			setPlaceholder,
		};
	},
});

export { PlaceholderBridge, PlaceholderEditorActionType, type PlaceholderMessage };
