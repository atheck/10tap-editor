import type { JSX } from "react";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	CoreBridge,
	DEFAULT_TOOLBAR_ITEMS,
	darkEditorCss,
	darkEditorTheme,
	type EditorBridge,
	RichText,
	TenTapStartKit,
	Toolbar,
	useBridgeState,
	useEditorBridge,
	useKeyboard,
} from "tentap-editor-heck";

const EDITOR_BACKGROUND_COLOR = "#1C1C1E";

const initialContent = "<p>dark</p>";

const exampleStyles = StyleSheet.create({
	fullScreen: {
		flex: 1,
	},
	container: {
		backgroundColor: EDITOR_BACKGROUND_COLOR,
	},
	editorContent: {
		paddingHorizontal: 12,
		backgroundColor: EDITOR_BACKGROUND_COLOR,
	},
	keyboardAvoidingView: {
		position: "absolute",
		width: "100%",
		bottom: 0,
	},
});

interface ToolbarWithColorProps {
	editor: EditorBridge;
}

function ToolbarWithColor({ editor }: ToolbarWithColorProps): JSX.Element {
	const editorState = useBridgeState(editor);
	const { isKeyboardUp: isNativeKeyboardUp } = useKeyboard();
	const hideToolbar = !isNativeKeyboardUp || !editorState.isFocused;

	return <Toolbar editor={editor} hidden={hideToolbar} items={DEFAULT_TOOLBAR_ITEMS} />;
}

function DarkEditor(): JSX.Element {
	const editor = useEditorBridge({
		autofocus: true,
		avoidIosKeyboard: true,
		initialContent,
		bridgeExtensions: [...TenTapStartKit, CoreBridge.configureCSS(darkEditorCss)],
		theme: darkEditorTheme,
	});

	return (
		<SafeAreaView style={[exampleStyles.fullScreen, exampleStyles.container]}>
			<View style={[exampleStyles.fullScreen, exampleStyles.editorContent]}>
				<RichText editor={editor} />
			</View>
			<KeyboardAvoidingView behavior={"padding"} style={exampleStyles.keyboardAvoidingView}>
				<ToolbarWithColor editor={editor} />
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

export { DarkEditor };
