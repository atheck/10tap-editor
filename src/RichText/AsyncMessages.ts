type Callback = (value: unknown) => void;

interface MessagePayload {
	messageId?: string;
	[key: string]: unknown;
}

interface AsyncMessage {
	type?: string;
	payload?: MessagePayload;
}

class AsyncMessages {
	public subscriptions: Record<string, Callback[]> = {};

	public constructor() {
		this.subscriptions = {};
	}

	public onMessage(id: string, value: unknown): void {
		if (this.subscriptions[id]) {
			for (const callback of this.subscriptions[id]) {
				callback(value);
			}
		}
	}

	public addListener(key: string, callback: Callback): void {
		if (!this.subscriptions[key]) {
			this.subscriptions[key] = [];
		}

		this.subscriptions[key].push(callback);
	}

	// biome-ignore lint/suspicious/useAwait: Return a new Promise is ok.
	public async sendAsyncMessage<TResult>(message: AsyncMessage, postMessage: (msg: AsyncMessage) => void): Promise<TResult> {
		const messageId = Math.random().toString(36).slice(7);

		message.payload ??= {};
		message.payload.messageId = messageId;

		return new Promise<TResult>((resolve) => {
			const callback: Callback = (value) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
				resolve(value as TResult);
			};

			this.addListener(messageId, callback);
			postMessage(message);
		});
	}
}

const asyncMessages = new AsyncMessages();

export { asyncMessages };
