import merge from "lodash/merge";
import type { RecursivePartial } from "../RichText";
import type { EditorTheme } from "../types";

function mergeThemes(theme1: EditorTheme, theme2: RecursivePartial<EditorTheme> | undefined): EditorTheme {
	return merge(theme1, theme2);
}

export { mergeThemes };
