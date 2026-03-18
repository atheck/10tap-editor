import { TaskItem, TaskList, type TaskListOptions } from "@tiptap/extension-list";
import { BridgeExtension } from "./base";

interface TaskListEditorState {
	isTaskListActive: boolean;
	canToggleTaskList: boolean;
	canLiftTaskListItem: boolean;
	canSinkTaskListItem: boolean;
}

interface TaskListEditorInstance {
	toggleTaskList: () => void;
	liftTaskListItem: () => void;
	sinkTaskListItem: () => void;
}

declare module "../types/EditorBridge" {
	interface BridgeState extends TaskListEditorState {}
	interface EditorBridge extends TaskListEditorInstance {}
}

type TaskListMessage =
	| {
			type: "toggle-task-list";
			payload?: undefined;
	  }
	| {
			type: "lift-task-list-item";
			payload?: undefined;
	  }
	| {
			type: "sink-task-list-item";
			payload?: undefined;
	  };

const TaskListEditorActionType = {
	toggleTaskList: "toggle-task-list",
	liftTaskListItem: "lift-task-list-item",
	sinkTaskListItem: "sink-task-list-item",
} as const;

const TaskListBridge = new BridgeExtension<TaskListEditorState, TaskListEditorInstance, TaskListMessage, TaskListOptions>({
	tiptapExtension: TaskList,
	tiptapExtensionDeps: [TaskItem.configure({ nested: true })],
	onBridgeMessage: (editor, message) => {
		if (message.type === TaskListEditorActionType.toggleTaskList) {
			editor.chain().focus().toggleTaskList().run();
		}
		if (message.type === TaskListEditorActionType.liftTaskListItem) {
			// biome-ignore lint/style/noNonNullAssertion: taskItem node is guaranteed to exist when this bridge is active
			editor.chain().focus().liftListItem(editor.state.schema.nodes.taskItem!.name).run();
		}
		if (message.type === TaskListEditorActionType.sinkTaskListItem) {
			// biome-ignore lint/style/noNonNullAssertion: taskItem node is guaranteed to exist when this bridge is active
			editor.chain().focus().sinkListItem(editor.state.schema.nodes.taskItem!.name).run();
		}

		return false;
	},
	extendEditorInstance: (sendBridgeMessage) => ({
		toggleTaskList: () => sendBridgeMessage({ type: TaskListEditorActionType.toggleTaskList }),
		liftTaskListItem: () => sendBridgeMessage({ type: TaskListEditorActionType.liftTaskListItem }),
		sinkTaskListItem: () => sendBridgeMessage({ type: TaskListEditorActionType.sinkTaskListItem }),
	}),
	extendEditorState: (editor) => ({
		canToggleTaskList: editor.can().toggleTaskList(),
		isTaskListActive: editor.isActive("taskList"),
		// biome-ignore lint/style/noNonNullAssertion: taskItem node is guaranteed to exist when this bridge is active
		canLiftTaskListItem: editor.can().liftListItem(editor.state.schema.nodes.taskItem!.name),
		// biome-ignore lint/style/noNonNullAssertion: taskItem node is guaranteed to exist when this bridge is active
		canSinkTaskListItem: editor.can().sinkListItem(editor.state.schema.nodes.taskItem!.name),
	}),
	extendCss: `
  ul[data-type="taskList"] {
    list-style: none;
    padding: 0;
  }

  ul[data-type="taskList"] > li {
    display: flex;
  }

  ul[data-type="taskList"] p {
    margin: 0;
  }

  ul[data-type="taskList"] li {
    display: flex;
  }

  ul[data-type="taskList"] li > label > input {
    font-size: inherit;
    font-family: inherit;
    color: #000;
    margin: 0.1rem;
    border: 1px solid black;
    border-radius: 0.3rem;
    padding: 0.1rem 0.4rem;
    background: white;
    accent-color: black;
  }
  ul[data-type="taskList"] li > label {
    flex: 0 0 auto;
    margin-right: 0.5rem;
    user-select: none;
  }

  ul[data-type="taskList"] li > div {
    flex: 1 1 auto;
  }
  `,
});

export { TaskListBridge, TaskListEditorActionType };
