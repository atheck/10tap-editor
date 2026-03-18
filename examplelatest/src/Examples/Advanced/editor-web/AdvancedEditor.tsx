import { Document } from "@tiptap/extension-document";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Text } from "@tiptap/extension-text";
import { EditorContent } from "@tiptap/react";
import type { JSX } from "react";
import { CoreBridge, useTenTap } from "tentap-editor-heck";
import { CounterBridge } from "../CounterBridge";

function AdvancedEditor(): JSX.Element {
	const editor = useTenTap({
		bridges: [CoreBridge, CounterBridge],
		tiptapOptions: {
			extensions: [Document, Paragraph, Text],
		},
	});

	return <EditorContent editor={editor} />;
}

export { AdvancedEditor };
