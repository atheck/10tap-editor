import Subscript, {
  type SubscriptExtensionOptions,
} from '@tiptap/extension-subscript';
import BridgeExtension from './base';

type SubscriptEditorState = {
  isSubscriptActive: boolean;
  canToggleSubscript: boolean;
};

type SubscriptEditorInstance = {
  toggleSubscript: () => void;
};

declare module '../types/EditorBridge' {
  interface BridgeState extends SubscriptEditorState {}
  interface EditorBridge extends SubscriptEditorInstance {}
}

export enum SubscriptEditorActionType {
  ToggleSubscript = 'toggle-subscript',
}

type SubscriptMessage = {
  type: SubscriptEditorActionType.ToggleSubscript;
  payload?: undefined;
};

export const SubscriptBridge = new BridgeExtension<
  SubscriptEditorState,
  SubscriptEditorInstance,
  SubscriptMessage,
  SubscriptExtensionOptions
>({
  tiptapExtension: Subscript,
  onBridgeMessage: (editor, message) => {
    if (message.type === SubscriptEditorActionType.ToggleSubscript) {
      editor.chain().focus().toggleSubscript().run();
    }

    return false;
  },
  extendEditorInstance: (sendBridgeMessage) => {
    return {
      toggleSubscript: () =>
        sendBridgeMessage({ type: SubscriptEditorActionType.ToggleSubscript }),
    };
  },
  extendEditorState: (editor) => {
    return {
      canToggleSubscript: editor.can().toggleSubscript(),
      isSubscriptActive: editor.isActive('subscript'),
    };
  },
});
