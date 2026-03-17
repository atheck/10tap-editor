import { TextStyle, type TextStyleOptions } from '@tiptap/extension-text-style';
import BridgeExtension from './base';

type TextStyleEditorState = {};

type TextStyleEditorInstance = {};

declare module '../types/EditorBridge' {
  interface BridgeState extends TextStyleEditorState {}
  interface EditorBridge extends TextStyleEditorInstance {}
}

export enum TextStyleEditorActionType {}

type TextStyleMessage = never;

export const TextStyleBridge = new BridgeExtension<
  TextStyleEditorState,
  TextStyleEditorInstance,
  TextStyleMessage,
  TextStyleOptions
>({
  tiptapExtension: TextStyle,
  onBridgeMessage: () => {
    return false;
  },
  extendEditorInstance: () => {
    return {};
  },
  extendEditorState: () => {
    return {};
  },
});
