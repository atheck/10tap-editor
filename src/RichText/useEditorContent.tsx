import debounce from "lodash/debounce";
import { useEffect, useState } from "react";
import type { EditorContentType } from "../bridges/core";
import type { EditorBridge } from "../types";

interface Options<TContent extends EditorContentType> {
	type?: TContent;
	debounceInterval?: number;
}

const DEFAULT_OPTIONS: Required<Options<"html">> = {
	type: "html",
	debounceInterval: 10,
};

type ContentType<TContent extends EditorContentType> = TContent extends "json" ? object : string;

function useEditorContent<TContent extends EditorContentType>(
	editor: EditorBridge,
	{ debounceInterval, type }: Options<TContent> = DEFAULT_OPTIONS as Options<TContent>,
): ContentType<TContent> | undefined {
	const [content, setContent] = useState<ContentType<TContent>>();

	useEffect(() => {
		const updateContent = debounce(async () => {
			switch (type) {
				case "json": {
					const json = await editor.getJSON();

					setContent(json as ContentType<TContent>);
					break;
				}
				case "text": {
					const text = await editor.getText();

					setContent(text as ContentType<TContent>);
					break;
				}
				default: {
					const html = await editor.getHTML();

					setContent(html as ContentType<TContent>);
					break;
				}
			}
		}, debounceInterval);

		const unsubscribe = editor.subscribeToEditorStateUpdate(() => {
			updateContent();
		});

		return () => {
			unsubscribe();
		};
	}, [editor, debounceInterval, type]);

	return content;
}

export { useEditorContent };
