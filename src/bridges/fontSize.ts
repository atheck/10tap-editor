/// <reference types="@tiptap/extension-text-style" />
import { Extension } from '@tiptap/core';
import { TextStyle } from '@tiptap/extension-text-style';
import BridgeExtension from './base';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (fontSize: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

const FontSize = Extension.create({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element: any) =>
              element.style.fontSize.replace(/['"]+/g, ''),
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
        ({ chain }: { chain: () => any }) => {
          return chain().setMark('textStyle', { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }: { chain: () => any }) => {
          return chain()
            .setMark('textStyle', { fontSize: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});

type FontSizeEditorState = {
  activeFontSize: string | undefined;
};

type FontSizeEditorInstance = {
  setFontSize: (fontSize: string) => void;
  unsetFontSize: () => void;
};

declare module '../types/EditorBridge' {
  interface BridgeState extends FontSizeEditorState {}
  interface EditorBridge extends FontSizeEditorInstance {}
}

export enum FontSizeEditorActionType {
  SetFontSize = 'set-font-size',
  UnsetFontSize = 'unset-font-size',
}

type FontSizeMessage =
  | {
      type: FontSizeEditorActionType.SetFontSize;
      payload: string;
    }
  | {
      type: FontSizeEditorActionType.UnsetFontSize;
      payload: undefined;
    };

export const FontSizeBridge = new BridgeExtension<
  FontSizeEditorState,
  FontSizeEditorInstance,
  FontSizeMessage
>({
  tiptapExtension: FontSize,
  tiptapExtensionDeps: [TextStyle],
  onBridgeMessage: (editor, { type, payload }) => {
    switch (type) {
      case FontSizeEditorActionType.SetFontSize:
        editor.chain().focus().setFontSize(payload).run();
        break;
      case FontSizeEditorActionType.UnsetFontSize:
        editor.chain().focus().unsetFontSize().run();
        break;
    }
    return false;
  },
  extendEditorInstance: (sendBridgeMessage) => {
    return {
      setFontSize: (fontSize) =>
        sendBridgeMessage({
          type: FontSizeEditorActionType.SetFontSize,
          payload: fontSize,
        }),
      unsetFontSize: () =>
        sendBridgeMessage({
          type: FontSizeEditorActionType.UnsetFontSize,
          payload: undefined,
        }),
    };
  },
  extendEditorState: (editor) => {
    return {
      activeFontSize: editor.getAttributes('textStyle').fontSize,
    };
  },
});
