import { Dropcursor } from "@tiptap/extensions";
import { BridgeExtension } from "./base";

const DropCursorBridge = new BridgeExtension({
	tiptapExtension: Dropcursor,
});

export { DropCursorBridge };
