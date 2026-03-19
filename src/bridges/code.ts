import { Code, type CodeOptions } from "@tiptap/extension-code";
import { BridgeExtension } from "./base";

interface CodeEditorState {
	isCodeActive: boolean;
	canToggleCode: boolean;
}

interface CodeEditorInstance {
	toggleCode: () => void;
}

declare module "../types/EditorBridge" {
	interface BridgeState extends CodeEditorState {}
	interface EditorBridge extends CodeEditorInstance {}
}

interface CodeMessage {
	type: "toggle-code";
	payload?: undefined;
}

const CodeEditorActionType = {
	toggleCode: "toggle-code",
} as const;

const CodeBridge = new BridgeExtension<CodeEditorState, CodeEditorInstance, CodeMessage, CodeOptions>({
	tiptapExtension: Code,
	onBridgeMessage: (editor, message) => {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- The only message for now.
		if (message.type === CodeEditorActionType.toggleCode) {
			editor.chain().focus().toggleCode().run();
		}

		return false;
	},
	extendEditorInstance: (sendBridgeMessage) => ({
		toggleCode: () => sendBridgeMessage({ type: CodeEditorActionType.toggleCode }),
	}),
	extendEditorState: (editor) => ({
		canToggleCode: editor.can().toggleCode(),
		isCodeActive: editor.isActive("code"),
	}),
	extendCss: `
    code {
        background-color: #6161611a;
        border-radius: 0.25em;
        box-decoration-break: clone;
        color: #616161;
        font-size: 0.9rem;
        padding: 0.25em;
    }
  `,
});

export { CodeBridge, CodeEditorActionType };
