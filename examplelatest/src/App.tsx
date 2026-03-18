import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator, type NativeStackScreenProps } from "@react-navigation/native-stack";
import type { JSX } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Advanced } from "./Examples/Advanced/AdvancedRichText";
import { Basic } from "./Examples/Basic";
import { ConfigureExtensions } from "./Examples/ConfigureExtentions";
import { CustomAndStaticToolbar } from "./Examples/CustomAndStaticToolbar/CustomAndStaticToolbar";
import { CustomCss } from "./Examples/CustomCss";
import { DarkEditor } from "./Examples/DarkEditor";
import { EditorStickToKeyboardExample } from "./Examples/EditorStickToKeyboardExample";
import { NavigationHeader } from "./Examples/NavigationHeader";

interface RootStackParamList {
	examples: undefined;
	basic: undefined;
	customCss: undefined;
	configureExtensions: undefined;
	darkEditor: undefined;
	editorStickToKeyboard: undefined;
	navigationHeader: undefined;
	customAndStaticToolbar: undefined;
	advanced: undefined;
}

const examples = [
	{ name: "basic" as const, title: "Basic", component: Basic },
	{ name: "customCss" as const, title: "Custom CSS", component: CustomCss },
	{ name: "configureExtensions" as const, title: "Configure Extensions", component: ConfigureExtensions },
	{ name: "darkEditor" as const, title: "Dark Editor", component: DarkEditor },
	{ name: "editorStickToKeyboard" as const, title: "EditorStickToKeyboardExample", component: EditorStickToKeyboardExample },
	{ name: "navigationHeader" as const, title: "NavigationHeader", component: NavigationHeader },
	{ name: "customAndStaticToolbar" as const, title: "CustomAndStaticToolbar", component: CustomAndStaticToolbar },
	{ name: "advanced" as const, title: "Advanced", component: Advanced },
];

const Stack = createNativeStackNavigator<RootStackParamList>();

const homeStyles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
	},
});

function HomeScreen({ navigation }: NativeStackScreenProps<RootStackParamList, "examples">): JSX.Element {
	return (
		<View style={homeStyles.container}>
			<Text>{"10Tap Rich Text Editor!"}</Text>
			{examples.map((example) => (
				<Button key={example.name} title={example.title} onPress={() => navigation.navigate(example.name)} />
			))}
		</View>
	);
}

function App(): JSX.Element {
	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={({ route }) => ({
					headerShown: route.name === "navigationHeader",
				})}
			>
				<Stack.Screen name={"examples"} component={HomeScreen} options={{ title: "Examples" }} />
				{examples.map((example) => (
					<Stack.Screen key={example.name} name={example.name} component={example.component} options={{ title: example.title }} />
				))}
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export { App };
