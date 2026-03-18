import type { CoreMessages } from "../bridges/core";

const EditorMessageType = {
	action: "action",
} as const;

interface EditorActionMessage {
	type: typeof EditorMessageType.action;
	payload: unknown;
	// Temporary, android new arch only
	id?: string;
}

type EditorMessage = EditorActionMessage | CoreMessages;

export { type EditorActionMessage, type EditorMessage, EditorMessageType };
