function uniqueBy<TItem>(items: TItem[], keyOrFn: keyof TItem | ((item: TItem) => unknown)): TItem[] {
	const keyFn = typeof keyOrFn === "function" ? keyOrFn : (item: TItem): unknown => item[keyOrFn];
	const seen = new Map<unknown, TItem>();

	for (const item of items) {
		const key = keyFn(item);

		seen.set(key, item);
	}

	// eslint-disable-next-line unicorn/prefer-iterator-to-array -- Not supported by Hermes.
	return [...seen.values()];
}

export { uniqueBy };
