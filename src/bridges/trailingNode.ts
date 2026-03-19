import { TrailingNode } from "@tiptap/extensions";
import { BridgeExtension } from "./base";

const TrailingNodeBridge = new BridgeExtension({
	tiptapExtension: TrailingNode,
});

export { TrailingNodeBridge };
