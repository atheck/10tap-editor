import HorizontalRule from '@tiptap/extension-horizontal-rule';
import BridgeExtension from './base';

type HorizontalRuleEditorState = {
  canSetHorizontalRule: boolean;
};

type HorizontalRuleEditorInstance = {
  setHorizontalRule: () => void;
};

declare module '../types/EditorBridge' {
  interface BridgeState extends HorizontalRuleEditorState {}
  interface EditorBridge extends HorizontalRuleEditorInstance {}
}

export enum HorizontalRuleEditorActionType {
  SetHorizontalRule = 'set-horizontal-rule',
}

type HorizontalRuleMessage = {
  type: HorizontalRuleEditorActionType.SetHorizontalRule;
  payload?: undefined;
};

export const HorizontalRuleBridge = new BridgeExtension<
  HorizontalRuleEditorState,
  HorizontalRuleEditorInstance,
  HorizontalRuleMessage
>({
  tiptapExtension: HorizontalRule,
  onBridgeMessage: (editor, message) => {
    if (message.type === HorizontalRuleEditorActionType.SetHorizontalRule) {
      editor.chain().focus().setHorizontalRule().run();
    }

    return false;
  },
  extendEditorInstance: (sendBridgeMessage) => {
    return {
      setHorizontalRule: () =>
        sendBridgeMessage({
          type: HorizontalRuleEditorActionType.SetHorizontalRule,
        }),
    };
  },
  extendEditorState: (editor) => {
    return {
      canSetHorizontalRule: editor.can().setHorizontalRule(),
    };
  },
  extendCSS: `
  hr {
    border-width: 0;
    border-top-width: thin;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.6);
  }
  `,
});
