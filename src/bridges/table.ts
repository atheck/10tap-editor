import {
	Table,
	TableCell,
	type TableCellOptions,
	TableHeader,
	type TableHeaderOptions,
	type TableOptions,
	TableRow,
	type TableRowOptions,
} from "@tiptap/extension-table";
import { BridgeExtension } from "./base";

interface TableConfig {
	table?: Partial<TableOptions>;
	tableRow?: Partial<TableRowOptions>;
	tableCell?: Partial<TableCellOptions>;
	tableHeader?: Partial<TableHeaderOptions>;
}

interface TableEditorState {
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
}

interface TableEditorInstance {
	insertTable: (options?: { rows?: number; cols?: number; withHeaderRow?: boolean }) => void;
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
}

declare module "../types/EditorBridge" {
	interface BridgeState extends TableEditorState {}
	interface EditorBridge extends TableEditorInstance {}
}

type TableMessage =
	| {
			type: "insert-table";
			payload?: { rows?: number; cols?: number; withHeaderRow?: boolean };
	  }
	| {
			type: "delete-table";
			payload?: undefined;
	  }
	| {
			type: "add-column-before";
			payload?: undefined;
	  }
	| {
			type: "add-column-after";
			payload?: undefined;
	  }
	| {
			type: "delete-column";
			payload?: undefined;
	  }
	| {
			type: "add-row-before";
			payload?: undefined;
	  }
	| {
			type: "add-row-after";
			payload?: undefined;
	  }
	| {
			type: "delete-row";
			payload?: undefined;
	  }
	| {
			type: "merge-cells";
			payload?: undefined;
	  }
	| {
			type: "split-cell";
			payload?: undefined;
	  }
	| {
			type: "go-to-next-cell";
			payload?: undefined;
	  }
	| {
			type: "go-to-previous-cell";
			payload?: undefined;
	  }
	| {
			type: "fix-tables";
			payload?: undefined;
	  }
	| {
			type: "toggle-header-row";
			payload?: undefined;
	  }
	| {
			type: "toggle-header-column";
			payload?: undefined;
	  }
	| {
			type: "toggle-header-cell";
			payload?: undefined;
	  };

const TableEditorActionType = {
	insertTable: "insert-table",
	deleteTable: "delete-table",
	addColumnBefore: "add-column-before",
	addColumnAfter: "add-column-after",
	deleteColumn: "delete-column",
	addRowBefore: "add-row-before",
	addRowAfter: "add-row-after",
	deleteRow: "delete-row",
	mergeCells: "merge-cells",
	splitCell: "split-cell",
	goToNextCell: "go-to-next-cell",
	goToPreviousCell: "go-to-previous-cell",
	fixTables: "fix-tables",
	toggleHeaderRow: "toggle-header-row",
	toggleHeaderColumn: "toggle-header-column",
	toggleHeaderCell: "toggle-header-cell",
} as const;

const TableBridge = new BridgeExtension<TableEditorState, TableEditorInstance, TableMessage, TableConfig>({
	tiptapExtension: Table,
	tiptapExtensionDeps: [TableRow, TableCell, TableHeader],
	onBridgeMessage: (editor, message) => {
		switch (message.type) {
			case TableEditorActionType.insertTable:
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
			case TableEditorActionType.deleteTable:
				editor.chain().focus().deleteTable().run();
				break;
			case TableEditorActionType.addColumnBefore:
				editor.chain().focus().addColumnBefore().run();
				break;
			case TableEditorActionType.addColumnAfter:
				editor.chain().focus().addColumnAfter().run();
				break;
			case TableEditorActionType.deleteColumn:
				editor.chain().focus().deleteColumn().run();
				break;
			case TableEditorActionType.addRowBefore:
				editor.chain().focus().addRowBefore().run();
				break;
			case TableEditorActionType.addRowAfter:
				editor.chain().focus().addRowAfter().run();
				break;
			case TableEditorActionType.deleteRow:
				editor.chain().focus().deleteRow().run();
				break;
			case TableEditorActionType.mergeCells:
				editor.chain().focus().mergeCells().run();
				break;
			case TableEditorActionType.splitCell:
				editor.chain().focus().splitCell().run();
				break;
			case TableEditorActionType.goToNextCell:
				editor.chain().focus().goToNextCell().run();
				break;
			case TableEditorActionType.goToPreviousCell:
				editor.chain().focus().goToPreviousCell().run();
				break;
			case TableEditorActionType.fixTables:
				editor.chain().focus().fixTables().run();
				break;
			case TableEditorActionType.toggleHeaderRow:
				editor.chain().focus().toggleHeaderRow().run();
				break;
			case TableEditorActionType.toggleHeaderColumn:
				editor.chain().focus().toggleHeaderColumn().run();
				break;
			case TableEditorActionType.toggleHeaderCell:
				editor.chain().focus().toggleHeaderCell().run();
				break;
		}

		return false;
	},
	extendEditorInstance: (sendBridgeMessage) => ({
		insertTable: (options) =>
			sendBridgeMessage({
				type: TableEditorActionType.insertTable,
				payload: options,
			}),
		deleteTable: () => sendBridgeMessage({ type: TableEditorActionType.deleteTable }),
		addColumnBefore: () => sendBridgeMessage({ type: TableEditorActionType.addColumnBefore }),
		addColumnAfter: () => sendBridgeMessage({ type: TableEditorActionType.addColumnAfter }),
		deleteColumn: () => sendBridgeMessage({ type: TableEditorActionType.deleteColumn }),
		addRowBefore: () => sendBridgeMessage({ type: TableEditorActionType.addRowBefore }),
		addRowAfter: () => sendBridgeMessage({ type: TableEditorActionType.addRowAfter }),
		deleteRow: () => sendBridgeMessage({ type: TableEditorActionType.deleteRow }),
		mergeCells: () => sendBridgeMessage({ type: TableEditorActionType.mergeCells }),
		splitCell: () => sendBridgeMessage({ type: TableEditorActionType.splitCell }),
		goToNextCell: () => sendBridgeMessage({ type: TableEditorActionType.goToNextCell }),
		goToPreviousCell: () => sendBridgeMessage({ type: TableEditorActionType.goToPreviousCell }),
		fixTables: () => sendBridgeMessage({ type: TableEditorActionType.fixTables }),
		toggleHeaderRow: () => sendBridgeMessage({ type: TableEditorActionType.toggleHeaderRow }),
		toggleHeaderColumn: () => sendBridgeMessage({ type: TableEditorActionType.toggleHeaderColumn }),
		toggleHeaderCell: () => sendBridgeMessage({ type: TableEditorActionType.toggleHeaderCell }),
	}),
	extendEditorState: (editor) => ({
		isTableActive: editor.isActive("table"),
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
	}),
	extendCss: `
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

export { TableBridge, TableEditorActionType };
