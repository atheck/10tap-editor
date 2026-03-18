import type { ColorValue, ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";

interface EditorTheme {
	toolbar: ToolbarTheme;
	webview: StyleProp<ViewStyle>;
	webviewContainer: StyleProp<ViewStyle>;
}

interface ToolbarTheme {
	toolbarBody: StyleProp<ViewStyle>;
	toolbarButton: StyleProp<ViewStyle>;
	iconDisabled: StyleProp<ImageStyle>;
	iconActive: StyleProp<ImageStyle>;
	icon: StyleProp<ImageStyle>;
	iconWrapper: StyleProp<ViewStyle>;
	iconWrapperDisabled: StyleProp<ViewStyle>;
	iconWrapperActive: StyleProp<ViewStyle>;
	hidden: StyleProp<ViewStyle>;
	keyboardAvoidingView: StyleProp<ViewStyle>;
	linkBarTheme: LinkBarTheme;
}

interface LinkBarTheme {
	addLinkContainer: StyleProp<ViewStyle>;
	linkInput: StyleProp<TextStyle>;
	placeholderTextColor?: ColorValue;
	doneButton: StyleProp<ViewStyle>;
	doneButtonText: StyleProp<TextStyle>;
	linkToolbarButton: StyleProp<ViewStyle>;
}

export type { EditorTheme, LinkBarTheme, ToolbarTheme };
