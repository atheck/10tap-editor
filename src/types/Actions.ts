const EditorActionType = {
	changeHighlight: "change-highlight",
	changeColor: "change-color",
	link: "link",
	toggleUnderline: "toggle-underline",
	setHardBreak: "set-hard-break",
} as const;

const EditorUpdateSettings = {
	focus: "focus",
} as const;

// Actions with no payload
type RegularActions =
	| typeof EditorActionType.changeHighlight
	| typeof EditorActionType.changeColor
	| typeof EditorActionType.link
	| typeof EditorActionType.toggleUnderline
	| typeof EditorActionType.setHardBreak;

interface RegularAction {
	type: RegularActions;
	payload?: unknown;
}

export { EditorActionType, EditorUpdateSettings, type RegularAction };
