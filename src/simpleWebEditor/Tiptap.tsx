import { EditorContent } from "@tiptap/react";
import type { JSX } from "react";
import { TenTapStartKit } from "../bridges/StarterKit";
import { useTenTap } from "../webEditorUtils";

const tenTapExtensions = TenTapStartKit.filter(
	(ext) => !window.whiteListBridgeExtensions || window.whiteListBridgeExtensions.includes(ext.name),
);

function Tiptap(): JSX.Element {
	const editor = useTenTap({ bridges: tenTapExtensions });

	return <EditorContent editor={editor} className={window.dynamicHeight ? "dynamic-height" : undefined} />;
}

export { Tiptap };
