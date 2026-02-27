import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Introduction',
      items: ['intro', 'mainConcepts'],
    },
    {
      type: 'category',
      label: 'Setup',
      items: ['setup/installation', 'setup/advancedSetup', 'setup/expoWeb'],
    },
    {
      type: 'category',
      label: 'Migration Guides',
      items: ['migrations/v1.0'],
    },
    {
      type: 'category',
      label: 'API',
      items: [
        'api/useEditorBridge',
        'api/EditorBridge',
        'api/BridgeState',
        'api/Components',
        'api/BridgeExtensions',
        'api/useEditorContent',
      ],
    },
    {
      type: 'category',
      label: 'Examples',
      collapsed: false, // Ensure the Examples category is open by default
      items: [
        'examples/basic',
        'examples/customCss',
        'examples/configureExtensions',
        'examples/navHeader',
        'examples/darkTheme',
        'examples/customTheme',
      ],
    },
  ],
};
export default sidebars;
