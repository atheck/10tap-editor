import { type JSX, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { type EditorBridge, RichText, TenTapStartKit, useBridgeState, useEditorBridge } from "tentap-editor-heck";
import { CounterBridge } from "./CounterBridge";
import { editorHtml } from "./editor-web/build/editorHtml";

const exampleStyles = StyleSheet.create({
	fullScreen: {
		flex: 1,
	},
});

function Counter({ editor }: { editor: EditorBridge }): JSX.Element {
	const state = useBridgeState(editor);

	return (
		<View>
			<Text>
				{state.wordCount}
				{" || "}
				{state.characterCount}
			</Text>
		</View>
	);
}

function Advanced(): JSX.Element {
	const editor = useEditorBridge({
		customSource: editorHtml,
		bridgeExtensions: [...TenTapStartKit, CounterBridge],
		autofocus: true,
		avoidIosKeyboard: true,
		initialContent:
			'<p>This is a basic example of implementing images.</p><img src="https://source.unsplash.com/8xznAGy4HcY/800x400" />',
	});
	const tapRef = useRef(null);

	return (
		<SafeAreaView style={exampleStyles.fullScreen} ref={tapRef}>
			<View style={exampleStyles.fullScreen}>
				<Counter editor={editor} />
				<RichText editor={editor} />
			</View>
		</SafeAreaView>
	);
}

export { Advanced };
