import type { AnyExtension, Editor } from "@tiptap/core";
import type { RefObject } from "react";
import type { WebView } from "react-native-webview";
import type { BridgeState, EditorBridge } from "../types";

// biome-ignore lint/suspicious/noExplicitAny: We need any here.
type CreateTenTapBridgeArgs<TState = any, TEditorInstance = any, TMessage = any, TConfig = any> = Omit<
	BridgeExtension<TState, TEditorInstance, TMessage, TConfig> & { forceName?: string },
	| "name"
	| "sendMessage"
	| "configureExtension"
	| "configureTiptapExtensionsOnRunTime"
	| "configureCss"
	| "extendExtension"
	| "clone"
>;

// biome-ignore lint/suspicious/noExplicitAny: We need any here.
class BridgeExtension<TState = any, TEditorInstance = any, TMessage = any, TConfig = any> {
	public name: string;
	public tiptapExtension?: AnyExtension;
	public tiptapExtensionDeps?: AnyExtension[];
	public onBridgeMessage?: (editor: Editor, message: TMessage, sendMessageBack: (response: TMessage) => void) => boolean;
	public onEditorMessage?: (message: TMessage, editorBridge: EditorBridge) => boolean;
	public extendEditorState?: (editor: Editor) => TState;
	public extendEditorInstance?: (
		sendBridgeMessage: (message: TMessage) => void,
		webviewRef?: RefObject<WebView>,
		editorState?: RefObject<BridgeState | Record<string, unknown>>,
		setEditorState?: (newState: BridgeState) => void,
		platform?: string,
	) => TEditorInstance;
	public extendCss?: string | undefined;
	public config?: TConfig;
	public extendConfig?: Record<string, unknown>;

	public constructor({
		forceName,
		tiptapExtension,
		tiptapExtensionDeps,
		onBridgeMessage,
		onEditorMessage,
		extendEditorState,
		extendEditorInstance,
		extendCss,
		config,
		extendConfig,
	}: CreateTenTapBridgeArgs<TState, TEditorInstance, TMessage, TConfig>) {
		if (tiptapExtension) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
			this.name = Array.isArray(tiptapExtension) ? tiptapExtension.map((ext) => ext.name).join("+") : tiptapExtension.name;
		} else {
			this.name = forceName ?? "BridgeExtension";
		}

		this.tiptapExtension = tiptapExtension;
		this.tiptapExtensionDeps = tiptapExtensionDeps;
		this.onBridgeMessage = onBridgeMessage;
		this.onEditorMessage = onEditorMessage;
		this.extendEditorState = extendEditorState;
		this.extendEditorInstance = extendEditorInstance;
		this.extendCss = extendCss;
		this.config = config;
		this.extendConfig = extendConfig;
	}

	// we can use clone, so that extensions can be configured without modifying
	// the values for each extension
	public clone(): BridgeExtension<TState, TEditorInstance, TMessage, TConfig> {
		return new BridgeExtension<TState, TEditorInstance, TMessage, TConfig>({
			// eslint-disable-next-line @typescript-eslint/no-misused-spread
			...this,
			forceName: this.name,
		});
	}

	// runs on native
	public configureExtension(config: TConfig): BridgeExtension<TState, TEditorInstance, TMessage, TConfig> {
		const cloned = this.clone();

		cloned.config = config;

		return cloned;
	}

	public configureCss(css: string): BridgeExtension<TState, TEditorInstance, TMessage, TConfig> {
		const cloned = this.clone();

		cloned.extendCss = this.extendCss ? this.extendCss + css : css;

		return cloned;
	}

	public extendExtension(config: Record<string, unknown>): BridgeExtension<TState, TEditorInstance, TMessage, TConfig> {
		const cloned = this.clone();

		cloned.extendConfig = config;

		return cloned;
	}

	// runs on web
	public configureTiptapExtensionsOnRunTime(
		config: Record<string, unknown> | undefined,
		extendConfig: Record<string, unknown> | undefined,
	): AnyExtension[] {
		if (this.tiptapExtension) {
			// If config has a key matching the extension name, use that slice (e.g. TableConfig);
			// otherwise fall back to the whole config object for backwards compatibility.
			const mainConfig = config?.[this.tiptapExtension.name] ?? config;

			if (mainConfig) {
				this.tiptapExtension = this.tiptapExtension.configure(mainConfig);
			}

			if (extendConfig) {
				this.tiptapExtension = this.tiptapExtension.extend(extendConfig);
			}
		}

		const deps = (this.tiptapExtensionDeps ?? []).map((dep) => {
			const depConfig = config?.[dep.name];

			return depConfig ? dep.configure(depConfig) : dep;
		});

		return [this.tiptapExtension, ...deps].filter((ext): ext is AnyExtension => ext !== undefined);
	}
}

export { BridgeExtension };
