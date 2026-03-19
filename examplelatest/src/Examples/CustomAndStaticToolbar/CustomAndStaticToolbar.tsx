import type { JSX } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { type EditorBridge, useBridgeState, useEditorBridge } from "tentap-editor-heck";
import { Icon } from "../Icon";
import { ComposeRichText } from "./CustomRichText";

const COLOR_WHITE = "white";
const COLOR_LIGHTGREY = "lightgrey";
const COLOR_LIGHTGRAY = "lightgray";
const COLOR_GREY = "grey";
const COLOR_BLACK = "black";
const ICON_FILL = "#5F6368";
const LABEL_TO = "To";
const LABEL_FROM = "From";
const MAIL_INITIAL_CONTENT =
	'<p><br><br><br><br><a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/atheck/10tap-editor">Sent With Tentap!</a></p>';

const exampleStyles = StyleSheet.create({
	fullScreen: {
		flex: 1,
		backgroundColor: COLOR_WHITE,
	},
	header: {
		paddingHorizontal: 14,
		backgroundColor: COLOR_WHITE,
	},
	topBar: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		height: 40,
		marginBottom: 10,
	},
	recipientArea: {
		gap: 8,
	},
	recipientField: {
		flexDirection: "row",
		gap: 8,
		alignItems: "center",
		paddingBottom: 8,
		borderBottomWidth: 1,
		borderBottomColor: COLOR_LIGHTGREY,
	},
	textPrimary: {
		fontSize: 16,
	},
	textSecondary: {
		fontSize: 14,
		color: COLOR_GREY,
	},
	staticToolbar: {
		justifyContent: "flex-end",
	},
});

interface StaticToolbarProps {
	editor: EditorBridge;
}

function StaticToolbar({ editor }: StaticToolbarProps): JSX.Element {
	const editorState = useBridgeState(editor);

	return (
		<View style={[exampleStyles.recipientField, exampleStyles.staticToolbar]}>
			<TouchableOpacity onPress={() => editor.undo()} disabled={!editorState.canUndo}>
				<Icon name={"undo"} fill={editorState.canUndo ? COLOR_BLACK : COLOR_LIGHTGRAY} />
			</TouchableOpacity>
			<TouchableOpacity onPress={() => editor.redo()} disabled={!editorState.canRedo}>
				<Icon name={"redo"} fill={editorState.canRedo ? COLOR_BLACK : COLOR_LIGHTGRAY} />
			</TouchableOpacity>
		</View>
	);
}

interface CustomAndStaticToolbarProps {
	navigation: { goBack: () => void };
}

function CustomAndStaticToolbar({ navigation }: CustomAndStaticToolbarProps): JSX.Element {
	const editor = useEditorBridge({
		avoidIosKeyboard: true,
		initialContent: MAIL_INITIAL_CONTENT,
	});

	const onSendClick = async (): Promise<void> => {
		const mailContent = await editor.getHTML();

		Alert.alert("Mail Content", mailContent);
	};

	return (
		<SafeAreaView style={exampleStyles.fullScreen}>
			<View style={exampleStyles.header}>
				<View style={exampleStyles.topBar}>
					<TouchableOpacity onPress={() => navigation.goBack()}>
						<Icon name={"close"} fill={ICON_FILL} />
					</TouchableOpacity>
					<TouchableOpacity onPress={onSendClick}>
						<Icon name={"send"} fill={ICON_FILL} />
					</TouchableOpacity>
				</View>
				<View style={exampleStyles.recipientArea}>
					<View style={exampleStyles.recipientField}>
						<Text style={exampleStyles.textSecondary}>{LABEL_TO}</Text>
						<TextInput style={exampleStyles.textPrimary} autoFocus placeholder={"tentap@example.com"} />
					</View>
					<View style={exampleStyles.recipientField}>
						<Text style={exampleStyles.textSecondary}>{LABEL_FROM}</Text>
						<TextInput style={exampleStyles.textPrimary} placeholder={"you@example.com"} />
					</View>
					<TextInput style={[exampleStyles.textPrimary, exampleStyles.recipientField]} placeholder={"Subject"} />
					<StaticToolbar editor={editor} />
				</View>
			</View>
			<ComposeRichText editor={editor} onSendClick={onSendClick} />
		</SafeAreaView>
	);
}

export { CustomAndStaticToolbar };
