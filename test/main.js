import { createApp } from 'vue';
import App from './App.vue';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import * as mdpress from '../dist/mdpress-monaco-editor.esm.js';

import 'highlight.js/styles/atom-one-dark.min.css';
import 'katex/dist/katex.min.css';
import 'viewerjs/dist/viewer.min.css';
import 'swiper/css/bundle';
import 'x-data-spreadsheet/dist/xspreadsheet.css';
import '../dist/mdpress-monaco-editor.css';

// Monaco Environment Setup
const workers = {
    json: jsonWorker,
    css: cssWorker,
    scss: cssWorker,
    less: cssWorker,
    html: htmlWorker,
    handlebars: htmlWorker,
    razor: htmlWorker,
    typescript: tsWorker,
    javascript: tsWorker
};

self.MonacoEnvironment = {
    getWorker(_, label) {
        return new (workers[label] || editorWorker)();
    }
};

window.mdpress = mdpress;

const app = createApp(App);
app.mount('#app');
