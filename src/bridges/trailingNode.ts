import { TrailingNode } from '@tiptap/extensions';
import BridgeExtension from './base';

export const TrailingNodeBridge = new BridgeExtension({
  tiptapExtension: TrailingNode,
});
