import CodeBlock from '@tiptap/extension-code-block';
import BridgeExtension from './base';

type CodeBlockEditorState = {
  isCodeBlockActive: boolean;
  canToggleCodeBlock: boolean;
  codeBlockLanguage: string | null | undefined;
};

type CodeBlockEditorInstance = {
  toggleCodeBlock: (language?: string) => void;
  setCodeBlock: (language?: string) => void;
};

declare module '../types/EditorBridge' {
  interface BridgeState extends CodeBlockEditorState {}
  interface EditorBridge extends CodeBlockEditorInstance {}
}

export enum CodeBlockEditorActionType {
  ToggleCodeBlock = 'toggle-code-block',
  SetCodeBlock = 'set-code-block',
}

type ToggleCodeBlockMessage = {
  type: CodeBlockEditorActionType.ToggleCodeBlock;
  payload?: string;
};

type SetCodeBlockMessage = {
  type: CodeBlockEditorActionType.SetCodeBlock;
  payload?: string;
};

type CodeBlockMessage = ToggleCodeBlockMessage | SetCodeBlockMessage;

export const CodeBlockBridge = new BridgeExtension<
  CodeBlockEditorState,
  CodeBlockEditorInstance,
  CodeBlockMessage
>({
  tiptapExtension: CodeBlock,
  onBridgeMessage: (editor, { type, payload }) => {
    switch (type) {
      case CodeBlockEditorActionType.ToggleCodeBlock:
        if (payload) {
          editor.chain().focus().toggleCodeBlock({ language: payload }).run();
        } else {
          editor.chain().focus().toggleCodeBlock().run();
        }
        break;
      case CodeBlockEditorActionType.SetCodeBlock:
        if (payload) {
          editor.chain().focus().setCodeBlock({ language: payload }).run();
        } else {
          editor.chain().focus().setCodeBlock().run();
        }
        break;
    }
    return false;
  },
  extendEditorInstance: (sendBridgeMessage) => {
    return {
      toggleCodeBlock: (language) =>
        sendBridgeMessage({
          type: CodeBlockEditorActionType.ToggleCodeBlock,
          payload: language,
        }),
      setCodeBlock: (language) =>
        sendBridgeMessage({
          type: CodeBlockEditorActionType.SetCodeBlock,
          payload: language,
        }),
    };
  },
  extendEditorState: (editor) => {
    return {
      canToggleCodeBlock: editor.can().toggleCodeBlock(),
      isCodeBlockActive: editor.isActive('codeBlock'),
      codeBlockLanguage: editor.getAttributes('codeBlock')?.language,
    };
  },
  extendCSS: `
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
