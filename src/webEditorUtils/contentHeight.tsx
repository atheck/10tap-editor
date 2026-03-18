// For some reason on expo, this file is parsed on native, and then we get an error
import { isExpo } from "../utils/misc";

class ContentHeightListener {
	public connected = false;
	private resizeObserver: ResizeObserver | null = null;
	private currentHeight: number | null = null;

	public connect(element: Element, cb: (height: number) => void): void {
		this.connected = true;
		this.currentHeight = element.getBoundingClientRect().height;
		cb(this.currentHeight);

		this.resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const newHeight = entry.target.getBoundingClientRect().height;

				if (this.currentHeight !== newHeight) {
					this.currentHeight = newHeight;
					cb(newHeight);
				}
			}
		});

		this.resizeObserver.observe(element);
	}

	public disconnect(): void {
		this.resizeObserver?.disconnect();
	}

	public get height(): number | null {
		return this.currentHeight;
	}
}

// when bundling because "document" does not exist. This is a hack to "shim" focusListener on expo
const shimmedHeightListener = {
	height: 0,
	// biome-ignore lint/suspicious/noEmptyBlockStatements: intentional no-op shim for expo
	connect: () => {},
	connected: true,
};
const contentHeightListener = isExpo() ? shimmedHeightListener : new ContentHeightListener();

export { contentHeightListener };
