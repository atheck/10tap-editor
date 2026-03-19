import { HorizontalRule, type HorizontalRuleOptions } from "@tiptap/extension-horizontal-rule";
import { BridgeExtension } from "./base";

interface HorizontalRuleEditorState {
	canSetHorizontalRule: boolean;
}

interface HorizontalRuleEditorInstance {
	setHorizontalRule: () => void;
}

declare module "../types/EditorBridge" {
	interface BridgeState extends HorizontalRuleEditorState {}
	interface EditorBridge extends HorizontalRuleEditorInstance {}
}

interface HorizontalRuleMessage {
	type: "set-horizontal-rule";
	payload?: undefined;
}

const HorizontalRuleEditorActionType = {
	setHorizontalRule: "set-horizontal-rule",
} as const;

const HorizontalRuleBridge = new BridgeExtension<
	HorizontalRuleEditorState,
	HorizontalRuleEditorInstance,
	HorizontalRuleMessage,
	HorizontalRuleOptions
>({
	tiptapExtension: HorizontalRule,
	onBridgeMessage: (editor, message) => {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- The only message for now.
		if (message.type === HorizontalRuleEditorActionType.setHorizontalRule) {
			editor.chain().focus().setHorizontalRule().run();
		}

		return false;
	},
	extendEditorInstance: (sendBridgeMessage) => ({
		setHorizontalRule: () =>
			sendBridgeMessage({
				type: HorizontalRuleEditorActionType.setHorizontalRule,
			}),
	}),
	extendEditorState: (editor) => ({
		canSetHorizontalRule: editor.can().setHorizontalRule(),
	}),
	extendCss: `
  hr {
    border-width: 0;
    border-top-width: thin;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.6);
  }
  `,
});

export { HorizontalRuleBridge, HorizontalRuleEditorActionType };
