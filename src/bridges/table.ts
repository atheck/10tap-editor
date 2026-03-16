import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import BridgeExtension from './base';

type TableEditorState = {
  isTableActive: boolean;
  canInsertTable: boolean;
  canDeleteTable: boolean;
  canAddColumnBefore: boolean;
  canAddColumnAfter: boolean;
  canDeleteColumn: boolean;
  canAddRowBefore: boolean;
  canAddRowAfter: boolean;
  canDeleteRow: boolean;
  canMergeCells: boolean;
  canSplitCell: boolean;
  canGoToNextCell: boolean;
  canGoToPreviousCell: boolean;
  canToggleHeaderRow: boolean;
  canToggleHeaderColumn: boolean;
  canToggleHeaderCell: boolean;
};

type TableEditorInstance = {
  insertTable: (options?: {
    rows?: number;
    cols?: number;
    withHeaderRow?: boolean;
  }) => void;
  deleteTable: () => void;
  addColumnBefore: () => void;
  addColumnAfter: () => void;
  deleteColumn: () => void;
  addRowBefore: () => void;
  addRowAfter: () => void;
  deleteRow: () => void;
  mergeCells: () => void;
  splitCell: () => void;
  goToNextCell: () => void;
  goToPreviousCell: () => void;
  fixTables: () => void;
  toggleHeaderRow: () => void;
  toggleHeaderColumn: () => void;
  toggleHeaderCell: () => void;
};

declare module '../types/EditorBridge' {
  interface BridgeState extends TableEditorState {}
  interface EditorBridge extends TableEditorInstance {}
}

export enum TableEditorActionType {
  InsertTable = 'insert-table',
  DeleteTable = 'delete-table',
  AddColumnBefore = 'add-column-before',
  AddColumnAfter = 'add-column-after',
  DeleteColumn = 'delete-column',
  AddRowBefore = 'add-row-before',
  AddRowAfter = 'add-row-after',
  DeleteRow = 'delete-row',
  MergeCells = 'merge-cells',
  SplitCell = 'split-cell',
  GoToNextCell = 'go-to-next-cell',
  GoToPreviousCell = 'go-to-previous-cell',
  FixTables = 'fix-tables',
  ToggleHeaderRow = 'toggle-header-row',
  ToggleHeaderColumn = 'toggle-header-column',
  ToggleHeaderCell = 'toggle-header-cell',
}

type TableMessage =
  | {
      type: TableEditorActionType.InsertTable;
      payload?: { rows?: number; cols?: number; withHeaderRow?: boolean };
    }
  | {
      type: TableEditorActionType.DeleteTable;
      payload?: undefined;
    }
  | {
      type: TableEditorActionType.AddColumnBefore;
      payload?: undefined;
    }
  | {
      type: TableEditorActionType.AddColumnAfter;
      payload?: undefined;
    }
  | {
      type: TableEditorActionType.DeleteColumn;
      payload?: undefined;
    }
  | {
      type: TableEditorActionType.AddRowBefore;
      payload?: undefined;
    }
  | {
      type: TableEditorActionType.AddRowAfter;
      payload?: undefined;
    }
  | {
      type: TableEditorActionType.DeleteRow;
      payload?: undefined;
    }
  | {
      type: TableEditorActionType.MergeCells;
      payload?: undefined;
    }
  | {
      type: TableEditorActionType.SplitCell;
      payload?: undefined;
    }
  | {
      type: TableEditorActionType.GoToNextCell;
      payload?: undefined;
    }
  | {
      type: TableEditorActionType.GoToPreviousCell;
      payload?: undefined;
    }
  | {
      type: TableEditorActionType.FixTables;
      payload?: undefined;
    }
  | {
      type: TableEditorActionType.ToggleHeaderRow;
      payload?: undefined;
    }
  | {
      type: TableEditorActionType.ToggleHeaderColumn;
      payload?: undefined;
    }
  | {
      type: TableEditorActionType.ToggleHeaderCell;
      payload?: undefined;
    };

export const TableBridge = new BridgeExtension<
  TableEditorState,
  TableEditorInstance,
  TableMessage
>({
  tiptapExtension: Table,
  tiptapExtensionDeps: [TableRow, TableCell, TableHeader],
  onBridgeMessage: (editor, message) => {
    switch (message.type) {
      case TableEditorActionType.InsertTable:
        editor
          .chain()
          .focus()
          .insertTable({
            rows: message.payload?.rows || 3,
            cols: message.payload?.cols || 3,
            withHeaderRow: message.payload?.withHeaderRow ?? true,
          })
          .run();
        break;
      case TableEditorActionType.DeleteTable:
        editor.chain().focus().deleteTable().run();
        break;
      case TableEditorActionType.AddColumnBefore:
        editor.chain().focus().addColumnBefore().run();
        break;
      case TableEditorActionType.AddColumnAfter:
        editor.chain().focus().addColumnAfter().run();
        break;
      case TableEditorActionType.DeleteColumn:
        editor.chain().focus().deleteColumn().run();
        break;
      case TableEditorActionType.AddRowBefore:
        editor.chain().focus().addRowBefore().run();
        break;
      case TableEditorActionType.AddRowAfter:
        editor.chain().focus().addRowAfter().run();
        break;
      case TableEditorActionType.DeleteRow:
        editor.chain().focus().deleteRow().run();
        break;
      case TableEditorActionType.MergeCells:
        editor.chain().focus().mergeCells().run();
        break;
      case TableEditorActionType.SplitCell:
        editor.chain().focus().splitCell().run();
        break;
      case TableEditorActionType.GoToNextCell:
        editor.chain().focus().goToNextCell().run();
        break;
      case TableEditorActionType.GoToPreviousCell:
        editor.chain().focus().goToPreviousCell().run();
        break;
      case TableEditorActionType.FixTables:
        editor.chain().focus().fixTables().run();
        break;
      case TableEditorActionType.ToggleHeaderRow:
        editor.chain().focus().toggleHeaderRow().run();
        break;
      case TableEditorActionType.ToggleHeaderColumn:
        editor.chain().focus().toggleHeaderColumn().run();
        break;
      case TableEditorActionType.ToggleHeaderCell:
        editor.chain().focus().toggleHeaderCell().run();
        break;
    }
    return false;
  },
  extendEditorInstance: (sendBridgeMessage) => {
    return {
      insertTable: (options) =>
        sendBridgeMessage({
          type: TableEditorActionType.InsertTable,
          payload: options,
        }),
      deleteTable: () =>
        sendBridgeMessage({ type: TableEditorActionType.DeleteTable }),
      addColumnBefore: () =>
        sendBridgeMessage({ type: TableEditorActionType.AddColumnBefore }),
      addColumnAfter: () =>
        sendBridgeMessage({ type: TableEditorActionType.AddColumnAfter }),
      deleteColumn: () =>
        sendBridgeMessage({ type: TableEditorActionType.DeleteColumn }),
      addRowBefore: () =>
        sendBridgeMessage({ type: TableEditorActionType.AddRowBefore }),
      addRowAfter: () =>
        sendBridgeMessage({ type: TableEditorActionType.AddRowAfter }),
      deleteRow: () =>
        sendBridgeMessage({ type: TableEditorActionType.DeleteRow }),
      mergeCells: () =>
        sendBridgeMessage({ type: TableEditorActionType.MergeCells }),
      splitCell: () =>
        sendBridgeMessage({ type: TableEditorActionType.SplitCell }),
      goToNextCell: () =>
        sendBridgeMessage({ type: TableEditorActionType.GoToNextCell }),
      goToPreviousCell: () =>
        sendBridgeMessage({ type: TableEditorActionType.GoToPreviousCell }),
      fixTables: () =>
        sendBridgeMessage({ type: TableEditorActionType.FixTables }),
      toggleHeaderRow: () =>
        sendBridgeMessage({ type: TableEditorActionType.ToggleHeaderRow }),
      toggleHeaderColumn: () =>
        sendBridgeMessage({ type: TableEditorActionType.ToggleHeaderColumn }),
      toggleHeaderCell: () =>
        sendBridgeMessage({ type: TableEditorActionType.ToggleHeaderCell }),
    };
  },
  extendEditorState: (editor) => {
    return {
      isTableActive: editor.isActive('table'),
      canInsertTable: editor.can().insertTable(),
      canDeleteTable: editor.can().deleteTable(),
      canAddColumnBefore: editor.can().addColumnBefore(),
      canAddColumnAfter: editor.can().addColumnAfter(),
      canDeleteColumn: editor.can().deleteColumn(),
      canAddRowBefore: editor.can().addRowBefore(),
      canAddRowAfter: editor.can().addRowAfter(),
      canDeleteRow: editor.can().deleteRow(),
      canMergeCells: editor.can().mergeCells(),
      canSplitCell: editor.can().splitCell(),
      canGoToNextCell: editor.can().goToNextCell(),
      canGoToPreviousCell: editor.can().goToPreviousCell(),
      canToggleHeaderRow: editor.can().toggleHeaderRow(),
      canToggleHeaderColumn: editor.can().toggleHeaderColumn(),
      canToggleHeaderCell: editor.can().toggleHeaderCell(),
    };
  },
  extendCSS: `
  table {
    border-collapse: collapse;
    table-layout: fixed;
    margin: 0;
    overflow-y: hidden;
    overflow-x: auto;
    display: block;
  }

  table td,
  table th {
    min-width: 1em;
    border: 1px solid #bdbdbd;
    padding: 3px 5px;
    vertical-align: top;
    box-sizing: border-box;
    position: relative;
  }

  table td > *,
  table th > * {
    margin-bottom: 0;
  }

  table th {
    font-weight: 500;
    text-align: left;
    background-color: rgba(0, 0, 0, 0.08);
  }

  table .selectedCell {
    background: rgba(200, 200, 255, 0.4);
  }

  table .column-resize-handle {
    position: absolute;
    right: -2px;
    top: 0;
    bottom: -2px;
    width: 4px;
    background-color: #adf;
    pointer-events: none;
  }

  table p {
    margin: 0;
  }
  `,
});
