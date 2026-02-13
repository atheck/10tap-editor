import TextAlign from '@tiptap/extension-text-align';
import BridgeExtension from './base';

type TextAlignEditorState = {
  activeTextAlign: string | undefined;
  canSetTextAlign: boolean;
};

type TextAlignEditorInstance = {
  setTextAlign: (alignment: 'left' | 'center' | 'right' | 'justify') => void;
  unsetTextAlign: () => void;
};

declare module '../types/EditorBridge' {
  interface BridgeState extends TextAlignEditorState {}
  interface EditorBridge extends TextAlignEditorInstance {}
}

export enum TextAlignEditorActionType {
  SetTextAlign = 'set-text-align',
  UnsetTextAlign = 'unset-text-align',
}

type SetTextAlignMessage = {
  type: TextAlignEditorActionType.SetTextAlign;
  payload: 'left' | 'center' | 'right' | 'justify';
};

type UnsetTextAlignMessage = {
  type: TextAlignEditorActionType.UnsetTextAlign;
  payload: undefined;
};

type TextAlignMessage = SetTextAlignMessage | UnsetTextAlignMessage;

export const TextAlignBridge = new BridgeExtension<
  TextAlignEditorState,
  TextAlignEditorInstance,
  TextAlignMessage
>({
  tiptapExtension: TextAlign.configure({
    types: ['heading', 'paragraph'],
    alignments: ['left', 'center', 'right', 'justify'],
  }),
  onBridgeMessage: (editor, { type, payload }) => {
    switch (type) {
      case TextAlignEditorActionType.SetTextAlign:
        editor.chain().focus().setTextAlign(payload).run();
        break;
      case TextAlignEditorActionType.UnsetTextAlign:
        editor.chain().focus().unsetTextAlign().run();
        break;
    }
    return false;
  },
  extendEditorInstance: (sendBridgeMessage) => {
    return {
      setTextAlign: (alignment) =>
        sendBridgeMessage({
          type: TextAlignEditorActionType.SetTextAlign,
          payload: alignment,
        }),
      unsetTextAlign: () =>
        sendBridgeMessage({
          type: TextAlignEditorActionType.UnsetTextAlign,
          payload: undefined,
        }),
    };
  },
  extendEditorState: (editor) => {
    return {
      activeTextAlign: editor.getAttributes('paragraph').textAlign,
      canSetTextAlign: editor.can().setTextAlign('left'),
    };
  },
});
