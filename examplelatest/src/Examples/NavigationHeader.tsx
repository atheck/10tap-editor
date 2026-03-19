import type { JSX } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RichText, Toolbar, useEditorBridge } from "tentap-editor-heck";

// IOS Only
const HEADER_HEIGHT = 38;

const exampleStyles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		paddingBottom: Platform.OS === "ios" ? HEADER_HEIGHT : 0,
	},
	keyboardAvoidingView: {
		position: "absolute",
		width: "100%",
		bottom: 0,
	},
});

function NavigationHeader(): JSX.Element {
	const editor = useEditorBridge({
		autofocus: true,
		avoidIosKeyboard: true,
	});

	// when we are using react-navigation header, we need to add keyboardVerticalOffset to KeyboardAvoidingView
	// the value of this should be the height of the header + the top inset
	const { top } = useSafeAreaInsets();
	const keyboardVerticalOffset = HEADER_HEIGHT + top;

	return (
		<>
			<View style={exampleStyles.contentContainer}>
				<RichText editor={editor} />
			</View>
			<KeyboardAvoidingView
				behavior={"padding"}
				style={exampleStyles.keyboardAvoidingView}
				keyboardVerticalOffset={Platform.OS === "ios" ? keyboardVerticalOffset : undefined}
			>
				<Toolbar editor={editor} />
			</KeyboardAvoidingView>
		</>
	);
}

export { NavigationHeader };
