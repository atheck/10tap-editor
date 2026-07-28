import { Link, type LinkOptions } from "@tiptap/extension-link";
import { BridgeExtension } from "./base";

interface LinkEditorState {
	isLinkActive: boolean;
	canSetLink: boolean;
	activeLink: string | undefined;
}

interface LinkEditorInstance {
	setLink: (link: string | null) => void;
}

declare module "../types/EditorBridge" {
	interface BridgeState extends LinkEditorState {}
	interface EditorBridge extends LinkEditorInstance {}
}

interface LinkMessage {
	type: "set-link";
	payload: null | string;
}

const LinkEditorActionType = {
	setLink: "set-link",
} as const;

const LinkBridge = new BridgeExtension<LinkEditorState, LinkEditorInstance, LinkMessage, LinkOptions>({
	tiptapExtension: Link.configure({
		openOnClick: false,
		autolink: true,
	}),
	onBridgeMessage: (editor, { type, payload }) => {
		if (type === LinkEditorActionType.setLink) {
			// cancelled
			if (payload === null) {
				return false;
			}

			// empty
			if (payload === "") {
				editor.chain().focus().extendMarkRange("link").unsetLink().setTextSelection(editor.state.selection.from).run();

				return false;
			}

			// update link
			editor
				.chain()
				.focus()
				.extendMarkRange("link")
				.setLink({ href: payload })
				.setTextSelection(editor.state.selection.from)
				.run();
		}

		return false;
	},
	extendEditorInstance: (sendBridgeMessage) => ({
		setLink: (link) =>
			sendBridgeMessage({
				type: LinkEditorActionType.setLink,
				payload: link,
			}),
	}),
	extendEditorState: (editor) => ({
		canSetLink: !editor.state.selection.empty,
		isLinkActive: editor.isActive("link"),
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		activeLink: editor.getAttributes("link").href,
	}),
});

export { LinkBridge, LinkEditorActionType };
