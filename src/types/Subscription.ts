type Subscription<TValue> = (cb: (val: TValue) => void) => () => void;

export type { Subscription };
