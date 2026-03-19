import { type JSX, useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, StyleSheet, TouchableOpacity, View } from "react-native";
import { RichText, useBridgeState } from "../../../../src/RichText";
import type { EditorBridge } from "../../../../src/types";
import { useKeyboard } from "../../../../src/utils";
import type { icons } from "../../assets";
import { Icon } from "../Icon";

const COLOR_WHITE = "white";
const COLOR_LIGHTGRAY = "lightgray";
const COLOR_LIGHTBLUE = "lightblue";
const COLOR_GRAY = "gray";
const COLOR_BLACK = "black";

type ToolbarType = "main" | "formatting";

const TOOLBAR_MAIN: ToolbarType = "main";
const TOOLBAR_FORMATTING: ToolbarType = "formatting";

const composeStyles = StyleSheet.create({
	compose: {
		flex: 1,
		paddingHorizontal: 14,
		backgroundColor: COLOR_WHITE,
	},
	keyboardAvoidingView: {
		position: "absolute",
		width: "100%",
		bottom: 0,
	},
	mainToolbar: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 8,
		paddingVertical: 4,
		backgroundColor: COLOR_WHITE,
		borderTopWidth: 1,
		borderTopColor: COLOR_LIGHTGRAY,
	},
	formattingToolbar: {
		flexDirection: "row",
		justifyContent: "flex-start",
		backgroundColor: COLOR_WHITE,
		borderTopWidth: 1,
		paddingVertical: 4,
		paddingHorizontal: 8,
		gap: 4,
		borderTopColor: COLOR_LIGHTGRAY,
	},
	button: {
		width: 24,
		margin: 4,
		padding: 5,
	},
	activeButton: {
		backgroundColor: COLOR_LIGHTBLUE,
		borderRadius: 10,
	},
	hidden: {
		display: "none",
	},
});

interface ComposeRichTextProps {
	editor: EditorBridge;
	onSendClick: () => void;
}

interface ComposeToolbarProps {
	editor: EditorBridge;
	onSendClick: () => void;
}

interface CustomToolbarAction {
	isActive: boolean;
	isDisabled: boolean;
	onPress: () => void;
	icon: keyof typeof icons;
}

function ComposeToolbar({ editor, onSendClick }: ComposeToolbarProps): JSX.Element {
	const editorState = useBridgeState(editor);
	const { isKeyboardUp } = useKeyboard();
	const [toolbarType, setToolbarType] = useState<ToolbarType>(TOOLBAR_MAIN);

	const hideToolbar = !isKeyboardUp || !editorState.isFocused;

	useEffect(() => {
		if (hideToolbar) {
			setToolbarType(TOOLBAR_MAIN);
		}
	}, [hideToolbar]);

	const formattingOptions: CustomToolbarAction[] = useMemo(
		() => [
			{
				isActive: true,
				isDisabled: false,
				onPress: () => {
					setToolbarType(TOOLBAR_MAIN);
				},
				icon: "formatting",
			},
			{
				isActive: editorState.isBoldActive,
				isDisabled: !editorState.canToggleBold,
				onPress: editor.toggleBold,
				icon: "bold",
			},
			{
				isActive: editorState.headingLevel === 1,
				isDisabled: !editorState.canToggleHeading,
				onPress: () => editor.toggleHeading(1),
				icon: "h1",
			},
		],
		[editor, editorState],
	);

	if (toolbarType === TOOLBAR_MAIN) {
		return (
			<View style={[hideToolbar && composeStyles.hidden, composeStyles.mainToolbar]}>
				<TouchableOpacity onPress={() => setToolbarType(TOOLBAR_FORMATTING)}>
					<Icon name={"formatting"} style={composeStyles.button} />
				</TouchableOpacity>
				<TouchableOpacity onPress={onSendClick}>
					<Icon name={"send"} style={composeStyles.button} />
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<View style={[hideToolbar && composeStyles.hidden, composeStyles.formattingToolbar]}>
			{formattingOptions.map(({ isDisabled, isActive, icon, onPress }) => (
				<TouchableOpacity
					onPress={onPress}
					disabled={isDisabled}
					style={isActive ? composeStyles.activeButton : undefined}
					key={icon}
				>
					<Icon name={icon} fill={isDisabled ? COLOR_GRAY : COLOR_BLACK} style={composeStyles.button} />
				</TouchableOpacity>
			))}
		</View>
	);
}

function ComposeRichText({ editor, onSendClick }: ComposeRichTextProps): JSX.Element {
	return (
		<>
			<View style={composeStyles.compose}>
				<RichText editor={editor} />
			</View>
			<KeyboardAvoidingView behavior={"padding"} style={composeStyles.keyboardAvoidingView}>
				<ComposeToolbar editor={editor} onSendClick={onSendClick} />
			</KeyboardAvoidingView>
		</>
	);
}

export { ComposeRichText };
