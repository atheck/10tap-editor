import type { JSX } from "react";
import { StyleSheet, View } from "react-native";
import type { EditorBridge } from "../../types";
import type { ToolbarItem } from "./actions";
import { ToolbarItemComp } from "./ToolbarItemComp";

interface WebToolbarProps {
	editor: EditorBridge;
	args: Parameters<ToolbarItem["onPress"]>[0];
	items: ToolbarItem[];
	hidden?: boolean;
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
	},
});

function WebToolbar({ args, editor, hidden, items }: WebToolbarProps): JSX.Element | null {
	if (hidden) {
		return null;
	}

	return (
		<View style={styles.container}>
			{items.map((item, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: toolbar items have no stable unique id
				<ToolbarItemComp {...item} args={args} editor={editor} key={i} />
			))}
		</View>
	);
}

export { WebToolbar };
