import { type RefObject, useEffect, useState } from "react";
import { findNodeHandle, type HostComponent } from "react-native";

const useRefHandle = (compRef: RefObject<HostComponent<unknown>>): number | undefined => {
	const [handle, setHandle] = useState<number | undefined>();

	useEffect(() => {
		if (!compRef.current) {
			return;
		}

		const reactTag = findNodeHandle(compRef.current);

		// eslint-disable-next-line react/set-state-in-effect -- the native tag is only resolvable via findNodeHandle after the ref is committed, so it can't be derived during render
		setHandle(reactTag || undefined);
	}, [compRef]);

	return handle;
};

export { useRefHandle };
