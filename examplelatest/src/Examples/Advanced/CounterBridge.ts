import { CharacterCount } from "@tiptap/extension-character-count";
import { BridgeExtension } from "tentap-editor-heck";

interface CounterEditorState {
	wordCount: number;
	characterCount: number;
}

interface CounterEditorInstance {}

declare module "tentap-editor-heck" {
	interface BridgeState extends CounterEditorState {}
	interface EditorBridge extends CounterEditorInstance {}
}

const CounterBridge = new BridgeExtension<CounterEditorState, CounterEditorInstance>({
	tiptapExtension: CharacterCount.configure({
		limit: 240,
	}),
	extendEditorState: (editor) => ({
		wordCount: editor.storage.characterCount.characters(),
		characterCount: editor.storage.characterCount.words(),
	}),
});

export { CounterBridge };
