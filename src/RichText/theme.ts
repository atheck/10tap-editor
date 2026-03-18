import type { EditorTheme, ToolbarTheme } from "../types";
import { darkToolbarTheme, defaultToolbarTheme } from "./Toolbar/toolbarTheme";

const DARK_EDITOR_BACKGROUND_COLOR = "#1C1C1E";

const defaultEditorTheme: EditorTheme = {
	toolbar: defaultToolbarTheme,
	webview: {
		backgroundColor: "white",
	},
	webviewContainer: {},
};

const darkEditorTheme: EditorTheme = {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
	toolbar: darkToolbarTheme as ToolbarTheme,
	webview: {
		backgroundColor: DARK_EDITOR_BACKGROUND_COLOR,
	},
	webviewContainer: {},
};

const darkEditorCss = `
  * {
    background-color: ${DARK_EDITOR_BACKGROUND_COLOR};
    color: white;
  }
  blockquote {
    border-left: 3px solid #babaca;
    padding-left: 1rem;
  }
  .highlight-background {
    background-color: #474749;
  }
  pre {
    border-color: rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.08);
  }
`;

export { darkEditorCss, darkEditorTheme, defaultEditorTheme };
