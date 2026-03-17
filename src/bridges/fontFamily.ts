import { TextStyle } from '@tiptap/extension-text-style';
import FontFamily, {
  type FontFamilyOptions,
} from '@tiptap/extension-font-family';
import BridgeExtension from './base';

type FontFamilyEditorState = {
  activeFontFamily: string | undefined;
};

type FontFamilyEditorInstance = {
  setFontFamily: (fontFamily: string) => void;
  unsetFontFamily: () => void;
};

declare module '../types/EditorBridge' {
  interface BridgeState extends FontFamilyEditorState {}
  interface EditorBridge extends FontFamilyEditorInstance {}
}

export enum FontFamilyEditorActionType {
  SetFontFamily = 'set-font-family',
  UnsetFontFamily = 'unset-font-family',
}

type FontFamilyMessage =
  | {
      type: FontFamilyEditorActionType.SetFontFamily;
      payload: string;
    }
  | {
      type: FontFamilyEditorActionType.UnsetFontFamily;
      payload: undefined;
    };

export const FontFamilyBridge = new BridgeExtension<
  FontFamilyEditorState,
  FontFamilyEditorInstance,
  FontFamilyMessage,
  FontFamilyOptions
>({
  tiptapExtension: FontFamily,
  tiptapExtensionDeps: [TextStyle],
  onBridgeMessage: (editor, { type, payload }) => {
    switch (type) {
      case FontFamilyEditorActionType.SetFontFamily:
        editor.chain().focus().setFontFamily(payload).run();
        break;
      case FontFamilyEditorActionType.UnsetFontFamily:
        editor.chain().focus().unsetFontFamily().run();
        break;
    }
    return false;
  },
  extendEditorInstance: (sendBridgeMessage) => {
    return {
      setFontFamily: (fontFamily) =>
        sendBridgeMessage({
          type: FontFamilyEditorActionType.SetFontFamily,
          payload: fontFamily,
        }),
      unsetFontFamily: () =>
        sendBridgeMessage({
          type: FontFamilyEditorActionType.UnsetFontFamily,
          payload: undefined,
        }),
    };
  },
  extendEditorState: (editor) => {
    return {
      activeFontFamily: editor.getAttributes('textStyle').fontFamily,
    };
  },
});
