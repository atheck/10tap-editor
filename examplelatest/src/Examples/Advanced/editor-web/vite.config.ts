import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { resolve } from 'path';

// This config is used to build the web editor into a single file

const libWebPath = resolve(__dirname, '../../../../../lib-web/index.mjs');

export default defineConfig({
  root: 'src/Examples/Advanced/editor-web/',
  build: {
    outDir: 'build',
  },
  resolve: {
    alias: [
      {
        find: 'tentap-editor-heck/web',
        replacement: libWebPath,
      },
      {
        find: 'tentap-editor-heck',
        replacement: libWebPath,
      },
      // We alias tiptap view and state to use the internal version of tiptap to avoid this error https://github.com/ueberdosis/tiptap/issues/3869#issuecomment-2167931620
      {
        find: '@tiptap/pm/view',
        replacement: libWebPath,
      },
      {
        find: '@tiptap/pm/state',
        replacement: libWebPath,
      },
    ],
  },
  plugins: [react(), viteSingleFile()],
  server: {
    port: 3000,
  },
});
