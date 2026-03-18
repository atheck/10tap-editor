import type { JSX } from "react";
import { Button, KeyboardAvoidingView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CodeBridge, CoreBridge, RichText, TenTapStartKit, Toolbar, useEditorBridge } from "tentap-editor-heck";
import { ProtestRiotFont } from "./CustomFont";

const customFont = `
${ProtestRiotFont}
* {
    font-family: 'Protest Riot', sans-serif;
}
`;

const customCodeBlockCss = `
code {
    background-color: #ffdede;
    border-radius: 0.25em;
    border-color: #e45d5d;
    border-width: 1px;
    border-style: solid;
    box-decoration-break: clone;
    color: #cd4242;
    font-size: 0.9rem;
    padding: 0.25em;
}
`;

const initialContent = "<p>Custom Font And CSS!</p></br><code>Custom Code Block</code></br><p></p>";

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

function CustomCss(): JSX.Element {
	const editor = useEditorBridge({
		autofocus: true,
		avoidIosKeyboard: true,
		initialContent,
		bridgeExtensions: [...TenTapStartKit, CoreBridge.configureCss(customFont), CodeBridge.configureCss(customCodeBlockCss)],
	});

	return (
		<SafeAreaView style={exampleStyles.fullScreen}>
			<Button
				title={"Random CodeBlock Color"}
				onPress={() => {
					editor.injectCSS(
						`
            code {
              background-color: #${Math.floor(Math.random() * 16_777_215).toString(16)};
              border-radius: 0.25em;
              border-color: #${Math.floor(Math.random() * 16_777_215).toString(16)};
              border-width: 1px;
              border-style: solid;
              box-decoration-break: clone;
              color: #${Math.floor(Math.random() * 16_777_215).toString(16)};
              font-size: 0.9rem;
              padding: 0.25em;
          }
          `,
						CodeBridge.name,
					);
				}}
			/>
			<Button
				title={"Random Font Size"}
				onPress={() => {
					editor.injectCSS(
						`
            * {
              font-size: ${Math.random() * 60}px;
            }
          `,
						"font-size",
					);
				}}
			/>
			<RichText editor={editor} />
			<KeyboardAvoidingView behavior={"padding"} style={exampleStyles.keyboardAvoidingView}>
				<Toolbar editor={editor} />
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

export { CustomCss };
