import { type RefObject, useEffect, useState } from "react";
import { findNodeHandle, type HostComponent } from "react-native";

const useRefHandle = (compRef: RefObject<HostComponent<unknown>>): number | undefined => {
	const [handle, setHandle] = useState<number | undefined>();

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (compRef.current) {
			const reactTag = findNodeHandle(compRef.current);

			setHandle(reactTag || undefined);
		}
	}, [compRef]);

	return handle;
};

export { useRefHandle };
