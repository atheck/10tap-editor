import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import BridgeExtension from './base';

const trailingNodeTypes = ['image', 'table'];

const TrailingNodeExtension = Extension.create({
  name: 'trailingNode',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('trailingNode'),
        appendTransaction: (_, __, newState) => {
          const { doc, tr, schema } = newState;
          const lastNode = doc.lastChild;

          if (
            !lastNode ||
            !trailingNodeTypes.includes(lastNode.type.name) ||
            !schema.nodes.paragraph
          ) {
            return null;
          }

          return tr.insert(doc.content.size, schema.nodes.paragraph.create());
        },
      }),
    ];
  },
});

export const TrailingNodeBridge = new BridgeExtension({
  tiptapExtension: TrailingNodeExtension,
});
