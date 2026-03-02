import { createApp } from 'vue';
import App from './App.vue';
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import * as mdpress from '../index.js';

// Monaco Environment Setup
self.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === 'json') {
            return new jsonWorker();
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            return new cssWorker();
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
            return new htmlWorker();
        }
        if (label === 'typescript' || label === 'javascript') {
            return new tsWorker();
        }
        return new editorWorker();
    }
};

window.mdpress = mdpress;

// Register plugins
mdpress.registerMonaco(monaco);

// Wait for window globals to load if necessary, or just rely on script tag order
if (window.Swiper) mdpress.registerSwiper(window.Swiper);
if (window.QRCode) mdpress.registerQRCode(window.QRCode);
if (window.mermaid) mdpress.registerMermaid(window.mermaid);
if (window.XLSX) mdpress.registerXLSX(window.XLSX);
if (window.x_spreadsheet) mdpress.registerX_spreadsheet(window.x_spreadsheet);
if (window.flowchart) mdpress.registerFlowChart(window.flowchart);

if (typeof window.prettier !== 'undefined' && typeof window.prettierPlugins !== 'undefined') {
    window.prettier.prettierPlugins = window.prettierPlugins;
    mdpress.registerPrettier(window.prettier);
}

const app = createApp(App);
app.mount('#app');
