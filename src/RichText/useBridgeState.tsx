import { useEffect, useState } from "react";
import type { BridgeState, EditorBridge } from "../types";

const useBridgeState = (editor: EditorBridge): BridgeState => {
	const [editorState, setEditorState] = useState(editor.getEditorState());

	useEffect(() => {
		const unsubscribe = editor.subscribeToEditorStateUpdate(setEditorState);

		return unsubscribe;
	}, [editor]);

	return editorState;
};

export { useBridgeState };
