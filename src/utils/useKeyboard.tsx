import React, { useEffect } from "react";
import { Keyboard, type KeyboardEventName, Platform } from "react-native";

const hideEvent: KeyboardEventName = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

const useKeyboard = (): { isKeyboardUp: boolean; keyboardHeight: number } => {
	const [isKeyboardUp, setIsKeyboardUp] = React.useState(false);
	const [keyboardHeight, setKeyboardHeight] = React.useState(0);

	useEffect(() => {
		const willShowSubscription = Keyboard.addListener("keyboardWillShow", () => {
			setIsKeyboardUp(true);
		});
		const didShowSubscription = Keyboard.addListener("keyboardDidShow", (event) => {
			setIsKeyboardUp(true);
			setKeyboardHeight(event.endCoordinates.height);
		});
		const hideSubscription = Keyboard.addListener(hideEvent, () => {
			setIsKeyboardUp(false);
			setKeyboardHeight(0);
		});

		return () => {
			willShowSubscription.remove();
			didShowSubscription.remove();
			hideSubscription.remove();
		};
	}, []);

	return { isKeyboardUp, keyboardHeight };
};

export { useKeyboard };
