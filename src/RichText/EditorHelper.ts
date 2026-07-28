import { useState } from "react";
import type { EditorBridge } from "../types";
import type { Subscription } from "../types/Subscription";

class _EditorHelper {
	public editorLastInstance: EditorBridge | undefined;
	public cbs: ((editor: EditorBridge | undefined) => void)[] = [];

	public constructor() {
		this.editorLastInstance = undefined;
	}

	public setEditorLastInstance(editorLastInstance: EditorBridge): void {
		this.editorLastInstance = editorLastInstance;

		for (const cb of this.cbs) {
			cb(editorLastInstance);
		}
	}

	public subscribe: Subscription<EditorBridge | undefined> = (cb) => {
		this.cbs.push(cb);

		return () => {
			this.cbs = this.cbs.filter((sub) => sub !== cb);
		};
	};
}

const EditorHelper = new _EditorHelper();

const useRemoteEditorBridge = (): EditorBridge | undefined => {
	// eslint-disable-next-line react/use-state -- setEditor is unused for now.
	const [editor, _setEditor] = useState<EditorBridge | undefined>(EditorHelper.editorLastInstance);

	// TODO: There is currently a bug on ios where the keyboard isn't unmounted when removed from subview.
	// Because of this we can't rely on it to unsubscribe. Once this is fixed we can add this again make it be reactive
	// useEffect(() => {
	//   const unsubscribe = EditorHelper.subscribe((editor) => {
	//     setEditor(editor);
	//   });

	//   return () => {
	//     unsubscribe();
	//   };
	// }, []);

	return editor;
};

export { EditorHelper, useRemoteEditorBridge };
