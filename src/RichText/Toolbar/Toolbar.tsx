import React, { type JSX } from "react";
import { FlatList, Platform, StyleSheet } from "react-native";
import type { EditorBridge } from "../../types";
import { useKeyboard } from "../../utils";
import { useBridgeState } from "../useBridgeState";
import { DEFAULT_TOOLBAR_ITEMS, HEADING_ITEMS, ToolbarContext, type ToolbarContextValue, type ToolbarItem } from "./actions";
import { EditLinkBar } from "./EditLinkBar";
import { ToolbarItemComp } from "./ToolbarItemComp";
import { WebToolbar } from "./WebToolbar";

interface ToolbarProps {
	editor: EditorBridge;
	hidden?: boolean;
	items?: ToolbarItem[];
	shouldHideDisabledToolbarItems?: boolean;
}

const toolbarStyles = StyleSheet.create({});

function Toolbar({
	editor,
	hidden,
	items = DEFAULT_TOOLBAR_ITEMS,
	shouldHideDisabledToolbarItems = false,
}: ToolbarProps): JSX.Element | null {
	const editorState = useBridgeState(editor);
	const { isKeyboardUp } = useKeyboard();
	const [toolbarContext, setToolbarContext] = React.useState<ToolbarContextValue>(ToolbarContext.main);

	const hideToolbar = hidden === undefined ? !isKeyboardUp || !editorState.isFocused : hidden;

	const args = {
		editor,
		editorState,
		setToolbarContext,
		toolbarContext,
	};

	const filteredItems = shouldHideDisabledToolbarItems ? items.filter((item) => !item.disabled(args)) : items;

	switch (toolbarContext) {
		case ToolbarContext.main:
		case ToolbarContext.heading:
			if (Platform.OS === "web") {
				return (
					<WebToolbar
						items={toolbarContext === ToolbarContext.main ? filteredItems : HEADING_ITEMS}
						args={args}
						editor={editor}
						hidden={hidden}
					/>
				);
			}

			return (
				<FlatList
					data={toolbarContext === ToolbarContext.main ? filteredItems : HEADING_ITEMS}
					style={[editor.theme.toolbar.toolbarBody, hideToolbar ? editor.theme.toolbar.hidden : undefined]}
					renderItem={({ item }) => <ToolbarItemComp {...item} args={args} editor={editor} />}
					horizontal
				/>
			);
		case ToolbarContext.link:
			return (
				<EditLinkBar
					theme={editor.theme}
					initialLink={editorState.activeLink}
					onBlur={() => {
						if (Platform.OS === "web") {
							// On web blur is called before onEditLink. This isn't an ideal fix however this is going to be change soon when we
							// add the new api for toolbar where we will have more control. This is a temporary fix for now.
							setTimeout(() => {
								setToolbarContext(ToolbarContext.main);
							}, 100);
						} else {
							setToolbarContext(ToolbarContext.main);
						}
					}}
					onLinkIconClick={() => {
						setToolbarContext(ToolbarContext.main);
						editor.focus();
					}}
					onEditLink={(link) => {
						editor.setLink(link);
						editor.focus();

						if (Platform.OS === "android") {
							// On android we dont want to hide the link input before we finished focus on editor
							// Add here 100ms and we can try to find better solution later
							setTimeout(() => {
								setToolbarContext(ToolbarContext.main);
							}, 100);
						} else {
							setToolbarContext(ToolbarContext.main);
						}
					}}
				/>
			);
	}
}

export { Toolbar, toolbarStyles };
