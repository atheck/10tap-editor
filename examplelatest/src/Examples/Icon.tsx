import type { JSX } from "react";
import type { ColorValue, StyleProp, ViewStyle } from "react-native";
import { SvgXml } from "react-native-svg";
import { icons } from "../assets";

interface IconProps {
	name: keyof typeof icons;
	style?: StyleProp<ViewStyle>;
	width?: number;
	height?: number;
	fill?: ColorValue;
}

function Icon({ style, name, fill, height = 24, width = 24 }: IconProps): JSX.Element {
	return <SvgXml style={style} width={width} height={height} xml={icons[name]} fill={fill} />;
}

export { Icon };
