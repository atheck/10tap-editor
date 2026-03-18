import { Platform } from "react-native";
import type { BridgeExtension } from "../bridges/base";
import type { EditorBridge } from "../types";

const formatForInjection = (js: string): string => js.replaceAll("\n", "").trim();

/**
 * Creates a new style element and appends it to the head of the document.
 * If the style element already exists, it will update the content of the existing element.
 * @param css - array of css strings
 * @param styleSheetTag - a unique tag to identify the style element - if not provided, a new style element will be created
 * @returns a string of javascript that is ready to be injected into the rich text webview
 */
// biome-ignore lint/style/useNamingConvention: CSS is a well-known acronym used in the public API
const getStyleSheetCSS = (css: string, styleSheetTag: string): string => `
    cssContent = \`${css}\`;
    head = document.head || document.getElementsByTagName('head')[0],
    styleElement = head.querySelector('style[data-tag="${styleSheetTag}"]');

    if (!styleElement) {
      // If no such element exists, create a new <style> element.
      styleElement = document.createElement('style');
      styleElement.setAttribute('data-tag', '${styleSheetTag}'); // Assign the unique 'data-tag' attribute.
      styleElement.type = 'text/css'; // Specify the type attribute for clarity.
      head.appendChild(styleElement); // Append the newly created <style> element to the <head>.
    }

    styleElement.innerHTML = cssContent;
    `;

// biome-ignore lint/style/useNamingConvention: JS is a well-known acronym used in the public API
const getInjectedJS = (bridgeExtensions: BridgeExtension[]): string => {
	let injectJs = "";
	// For each bridge extension, we create a stylesheet with it's name as the tag
	const styleSheets = bridgeExtensions.map(({ extendCss, name }) => getStyleSheetCSS(extendCss || "", name));

	injectJs += styleSheets.join(" ");
	injectJs += " true;";

	return injectJs;
};

/**
 * Get js code to inject into webview before the content loads
 */
// biome-ignore lint/style/useNamingConvention: JS is a well-known acronym used in the public API
const getInjectedJSBeforeContentLoad = (editor: EditorBridge): string =>
	formatForInjection(`${
		editor.bridgeExtensions
			? `
      window.bridgeExtensionConfigMap = '${JSON.stringify(
				editor.bridgeExtensions.reduce<Record<string, { optionsConfig: unknown; extendConfig: unknown }>>((acc, bridge) => {
					acc[bridge.name] = {
						optionsConfig: bridge.config,
						extendConfig: bridge.extendConfig,
					};

					return acc;
				}, {}),
			)}';

      window.whiteListBridgeExtensions = [${editor.bridgeExtensions
				.map((bridgeExtension) => `'${bridgeExtension.name}'`)
				.join(",")}];
          `
			: ""
	}${editor.initialContent ? `window.initialContent = ${JSON.stringify(editor.initialContent)};` : ""}
    window.editable = ${editor.editable};
    window.disableColorHighlight = ${Boolean(editor.disableColorHighlight)};
    window.dynamicHeight = ${editor.dynamicHeight};
    window.contentInjected = true;
    window.platform = "${Platform.OS}";
  `);

export { getInjectedJS, getInjectedJSBeforeContentLoad, getStyleSheetCSS };
