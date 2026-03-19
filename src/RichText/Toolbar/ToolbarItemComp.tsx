import type { JSX } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import type { EditorBridge } from "../../types";
import type { ToolbarItem } from "./actions";

function ToolbarItemComp({
	onPress,
	disabled,
	active,
	image,
	editor,
	args,
}: ToolbarItem & {
	editor: EditorBridge;
	args: Parameters<ToolbarItem["onPress"]>[0];
}): JSX.Element {
	return (
		<TouchableOpacity onPress={onPress(args)} disabled={disabled(args)} style={editor.theme.toolbar.toolbarButton}>
			<View
				style={[
					editor.theme.toolbar.iconWrapper,
					active(args) ? editor.theme.toolbar.iconWrapperActive : undefined,
					disabled(args) ? editor.theme.toolbar.iconWrapperDisabled : undefined,
				]}
			>
				<Image
					source={image(args)}
					style={[
						editor.theme.toolbar.icon,
						active(args) ? editor.theme.toolbar.iconActive : undefined,
						disabled(args) ? editor.theme.toolbar.iconDisabled : undefined,
					]}
					resizeMode={"contain"}
				/>
			</View>
		</TouchableOpacity>
	);
}

export { ToolbarItemComp };
