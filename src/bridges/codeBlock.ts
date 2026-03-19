import { CodeBlock, type CodeBlockOptions } from "@tiptap/extension-code-block";
import { BridgeExtension } from "./base";

interface CodeBlockEditorState {
	isCodeBlockActive: boolean;
	canToggleCodeBlock: boolean;
	codeBlockLanguage: string | null | undefined;
}

interface CodeBlockEditorInstance {
	toggleCodeBlock: (language?: string) => void;
	setCodeBlock: (language?: string) => void;
}

declare module "../types/EditorBridge" {
	interface BridgeState extends CodeBlockEditorState {}
	interface EditorBridge extends CodeBlockEditorInstance {}
}

interface ToggleCodeBlockMessage {
	type: "toggle-code-block";
	payload?: string;
}

interface SetCodeBlockMessage {
	type: "set-code-block";
	payload?: string;
}

type CodeBlockMessage = ToggleCodeBlockMessage | SetCodeBlockMessage;

const CodeBlockEditorActionType = {
	toggleCodeBlock: "toggle-code-block",
	setCodeBlock: "set-code-block",
} as const;

const CodeBlockBridge = new BridgeExtension<CodeBlockEditorState, CodeBlockEditorInstance, CodeBlockMessage, CodeBlockOptions>({
	tiptapExtension: CodeBlock,
	onBridgeMessage: (editor, { type, payload }) => {
		switch (type) {
			case CodeBlockEditorActionType.toggleCodeBlock:
				if (payload) {
					editor.chain().focus().toggleCodeBlock({ language: payload }).run();
				} else {
					editor.chain().focus().toggleCodeBlock().run();
				}

				break;
			case CodeBlockEditorActionType.setCodeBlock:
				if (payload) {
					editor.chain().focus().setCodeBlock({ language: payload }).run();
				} else {
					editor.chain().focus().setCodeBlock().run();
				}

				break;
		}

		return false;
	},
	extendEditorInstance: (sendBridgeMessage) => ({
		toggleCodeBlock: (language) =>
			sendBridgeMessage({
				type: CodeBlockEditorActionType.toggleCodeBlock,
				payload: language,
			}),
		setCodeBlock: (language) =>
			sendBridgeMessage({
				type: CodeBlockEditorActionType.setCodeBlock,
				payload: language,
			}),
	}),
	extendEditorState: (editor) => ({
		canToggleCodeBlock: editor.can().toggleCodeBlock(),
		isCodeBlockActive: editor.isActive("codeBlock"),
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		codeBlockLanguage: editor.getAttributes("codeBlock").language,
	}),
	extendCss: `
  pre {
    margin-top: 4px;
    margin-bottom: 4px;
    padding: 8px;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.04);
    line-height: 1.4;
    overflow-x: auto;
    white-space: pre !important;
  }

  pre code {
    color: inherit;
    padding: 0;
    background: none;
  }
  `,
});

export { CodeBlockBridge, CodeBlockEditorActionType };
