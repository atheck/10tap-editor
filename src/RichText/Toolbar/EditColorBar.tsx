import type { JSX } from "react";
import { Button, StyleSheet, View } from "react-native";

const toolbarStyles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "row",
	},
});

interface EditColorProps {
	onFinish: () => void;
}

function EditColorBar({ onFinish }: EditColorProps): JSX.Element {
	return (
		<View style={toolbarStyles.container}>
			<Button title={"DONE"} onPress={onFinish} />
		</View>
	);
}

export { EditColorBar };
