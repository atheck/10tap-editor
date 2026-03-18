import { type JSX, useRef, useState } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { RichText, Toolbar, useEditorBridge } from "tentap-editor-heck";

const COLOR_MESSAGE_BOX = "#828282";
const COLOR_WHITE = "white";

const exampleStyles = StyleSheet.create({
	fullScreen: {
		flex: 1,
	},
	keyboardAvoidingView: {
		position: "absolute",
		width: "100%",
		bottom: 0,
	},
	messageBox: {
		minHeight: 70,
		padding: 3,
		backgroundColor: COLOR_MESSAGE_BOX,
		margin: 5,
		borderRadius: 3,
		maxWidth: "70%",
	},
	editorWrapper: {
		height: 70,
		paddingLeft: 12,
		backgroundColor: COLOR_WHITE,
		flexDirection: "row",
	},
	sendButton: {
		width: 50,
		justifyContent: "center",
		alignItems: "center",
	},
	scrollContent: {
		paddingBottom: 120,
	},
});

const defaultMessages = [{ text: "Hello World!", date: Date.now() }];

function EditorStickToKeyboardExample(): JSX.Element {
	const editor = useEditorBridge({
		autofocus: true,
		initialContent: "<p>Initial lovely message...</p>",
	});
	const messagesScrollViewRef = useRef<ScrollView>(null);
	const tapRef = useRef(null);
	const [messages, setMessages] = useState<{ text: string; date: number }[]>(defaultMessages);

	const onSendMessage = async (): Promise<void> => {
		const content = await editor.getHTML();

		setMessages((prev) => [...prev, { text: content, date: Date.now() }]);
		editor.setContent("");
		setTimeout(() => {
			messagesScrollViewRef.current?.scrollToEnd({ animated: true });
		}, 100);
	};

	return (
		<SafeAreaView style={exampleStyles.fullScreen} ref={tapRef}>
			<ScrollView
				automaticallyAdjustKeyboardInsets={true}
				ref={messagesScrollViewRef}
				contentContainerStyle={exampleStyles.scrollContent}
			>
				{messages.map((message, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: It's ok here.
					<View key={index} style={exampleStyles.messageBox}>
						<WebView
							source={{
								html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>${message.text}</body></html>`,
							}}
						/>
					</View>
				))}
			</ScrollView>
			<KeyboardAvoidingView behavior={"padding"} style={exampleStyles.keyboardAvoidingView}>
				<View style={exampleStyles.editorWrapper}>
					<RichText editor={editor} />
					<TouchableOpacity style={exampleStyles.sendButton} onPress={onSendMessage}>
						<Text>{">"}</Text>
					</TouchableOpacity>
				</View>
				<Toolbar editor={editor} />
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

export { EditorStickToKeyboardExample };
