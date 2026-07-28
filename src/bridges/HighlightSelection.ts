import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { Extension } from "@tiptap/react";

const blueBackgroundPluginKey = new PluginKey<DecorationSet>("blueBackground");

const blueBackgroundPlugin = Extension.create({
	name: "eventHandler",

	addProseMirrorPlugins() {
		return [
			new Plugin({
				key: blueBackgroundPluginKey,
				state: {
					init() {
						return DecorationSet.empty;
					},
					apply(tr, _oldState, _oldEditorState, newEditorState) {
						if (tr.selection.empty) {
							// If there is no selection, return the old state
							return DecorationSet.empty;
						}

						// If there is a selection, create a decoration
						const decorations: Decoration[] = [];
						const { from, to } = tr.selection;

						decorations.push(
							Decoration.inline(from, to, {
								class: "highlight-background",
							}),
						);

						return DecorationSet.create(newEditorState.doc, decorations);
					},
				},
				props: {
					decorations(state) {
						return blueBackgroundPluginKey.getState(state);
					},
				},
			}),
		];
	},
});

export { blueBackgroundPlugin };
