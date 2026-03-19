import type { JSX } from "react";
import { KeyboardAvoidingView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RichText, Toolbar, useEditorBridge } from "tentap-editor-heck";

const initialContent = "<p>This is a basic example</p>";

const exampleStyles = StyleSheet.create({
	fullScreen: {
		flex: 1,
	},
	keyboardAvoidingView: {
		position: "absolute",
		width: "100%",
		bottom: 0,
	},
});

function Basic(): JSX.Element {
	const editor = useEditorBridge({
		autofocus: true,
		avoidIosKeyboard: true,
		initialContent,
	});

	return (
		<SafeAreaView style={exampleStyles.fullScreen}>
			<RichText editor={editor} />
			<KeyboardAvoidingView behavior={"padding"} style={exampleStyles.keyboardAvoidingView}>
				<Toolbar editor={editor} />
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

export { Basic };
