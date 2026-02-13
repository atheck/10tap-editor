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
    background: #0d0d0d;
    color: #fff;
    font-family: 'JetBrainsMono', 'Courier New', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
  }

  pre code {
    color: inherit;
    padding: 0;
    background: none;
    font-size: 0.875rem;
  }

  pre .hljs-comment,
  pre .hljs-quote {
    color: #616161;
  }

  pre .hljs-variable,
  pre .hljs-template-variable,
  pre .hljs-attribute,
  pre .hljs-tag,
  pre .hljs-name,
  pre .hljs-regexp,
  pre .hljs-link,
  pre .hljs-selector-id,
  pre .hljs-selector-class {
    color: #f98181;
  }

  pre .hljs-number,
  pre .hljs-meta,
  pre .hljs-built_in,
  pre .hljs-builtin-name,
  pre .hljs-literal,
  pre .hljs-type,
  pre .hljs-params {
    color: #fbbc88;
  }

  pre .hljs-string,
  pre .hljs-symbol,
  pre .hljs-bullet {
    color: #b9f18d;
  }

  pre .hljs-title,
  pre .hljs-section {
    color: #faf594;
  }

  pre .hljs-keyword,
  pre .hljs-selector-tag {
    color: #70cff8;
  }

  pre .hljs-emphasis {
    font-style: italic;
  }

  pre .hljs-strong {
    font-weight: 700;
  }
  `,
});
