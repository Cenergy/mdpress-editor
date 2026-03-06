import { defineConfig } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'index.js'),
      name: 'mdpress',
      fileName: (format) => `mdpress-monaco-editor.${format === 'es' ? 'esm.js' : 'js'}`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      // 外部化所有 dependencies 中的依赖
      external: [
        'highlight.js',
        'monaco-editor',
        'mermaid',
        'shiki',
        'katex',
        'markdown-it',
        'dayjs',
        'swiper',
        'viewerjs',
        'x-data-spreadsheet',
        /^prettier/,
        'file-saver',
        'qrcode',
        'flowchart.js',
        'xlsx',
        'html-to-image',
        'print-js',
        'markmap-common',
        'markmap-lib',
        'markmap-view',
        'emoji-mart',
        '@emoji-mart/data'
      ],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          'highlight.js': 'hljs',
          'monaco-editor': 'monaco',
          'mermaid': 'mermaid',
          'shiki': 'shiki',
          'katex': 'katex',
          'markdown-it': 'markdownit',
          'dayjs': 'dayjs',
          'swiper': 'Swiper',
          'viewerjs': 'Viewer',
          'x-data-spreadsheet': 'Spreadsheet',
          'prettier': 'prettier',
          'file-saver': 'saveAs',
          'qrcode': 'QRCode',
          'flowchart.js': 'flowchart',
          'xlsx': 'XLSX',
          'html-to-image': 'htmlToImage',
          'print-js': 'printJS',
          'markmap-common': 'markmapCommon',
          'markmap-lib': 'markmapLib',
          'markmap-view': 'markmapView',
          'emoji-mart': 'EmojiMart',
          '@emoji-mart/data': 'EmojiMartData'
        },
        // 解决 UMD 模式下可能出现的 require 报错问题
        exports: 'named'
      }
    },
    commonjsOptions: {
      // 关键配置：允许处理混合了 ESM 和 CommonJS 的模块
      transformMixedEsModules: true
    },
    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true
      }
    },
    copyPublicDir: false
  },
  resolve: {
    alias: {
      // 如果某些依赖在浏览器环境需要特殊处理，可以在这里添加
    }
  },
  define: {
    // 许多库依赖于 process.env.NODE_ENV
    'process.env.NODE_ENV': JSON.stringify('production'),
    // 如果有库使用了 global，可以将其映射到 globalThis
    'global': 'globalThis'
  }
});
