import { type JSX, useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DropCursorBridge, LinkBridge, PlaceholderBridge, RichText, TenTapStartKit, useEditorBridge } from "tentap-editor-heck";

const DROP_CURSOR_COLOR = "#84affe";

const exampleStyles = StyleSheet.create({
	fullScreen: {
		flex: 1,
	},
});

function ConfigureExtensions(): JSX.Element {
	const [hideContent, setHideContent] = useState(false);
	const editor = useEditorBridge({
		autofocus: true,
		avoidIosKeyboard: true,
		bridgeExtensions: [
			...TenTapStartKit,
			PlaceholderBridge.configureExtension({
				placeholder: "Hey there! Start typing...",
			}),
			LinkBridge.configureExtension({ openOnClick: false }),
			DropCursorBridge.configureExtension({
				color: DROP_CURSOR_COLOR,
				width: 2,
			}),
		],
	});

	return (
		<SafeAreaView style={exampleStyles.fullScreen}>
			<View>
				<Button
					title={"Toggle Content"}
					onPress={() => {
						editor.setContent(
							hideContent
								? ""
								: `<a href="https://github.com/atheck/10tap-editor">Link To TenTap!</a>
            <p>Try to drag around the image. While you drag, the editor should show a decoration under your cursor. The so called dropcursor.</p></br>
            <img src="https://source.unsplash.com/8xznAGy4HcY/800x400" /></br>
            <p>Drag Me Here</p></br></br></br></br></br><p>Or Here</p>`,
						);
						setHideContent(!hideContent);
					}}
				/>
				<Button
					title={"Change Placeholder"}
					onPress={() => {
						editor.setPlaceholder(`New PLACEHOLDER at: ${new Date().toISOString()}`);
						setHideContent(!hideContent);
					}}
				/>
			</View>
			<View style={exampleStyles.fullScreen}>
				<RichText editor={editor} />
			</View>
		</SafeAreaView>
	);
}

export { ConfigureExtensions };
