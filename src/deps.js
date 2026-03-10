
import * as monaco from 'monaco-editor';
import hljs from 'highlight.js';
import * as prettier from 'prettier/standalone';
import * as prettierPluginBabel from 'prettier/plugins/babel';
import * as prettierPluginEstree from 'prettier/plugins/estree';
import * as prettierPluginHtml from 'prettier/plugins/html';
import * as prettierPluginMarkdown from 'prettier/plugins/markdown';
import * as prettierPluginPostcss from 'prettier/plugins/postcss';
import * as prettierPluginTypescript from 'prettier/plugins/typescript';

import Swiper from 'swiper';
import QRCode from 'qrcode';
import mermaid from 'mermaid';
import * as XLSX from 'xlsx';
import X_spreadsheet from 'x-data-spreadsheet';
import flowchart from 'flowchart.js';
import { getHighlighter } from 'shiki';
import * as markmapCommon from 'markmap-common';
import * as markmapView from 'markmap-view';
import * as markmapLib from 'markmap-lib';

// Shiki initialization
let shikiHighlighter;
const isDev = import.meta.env.DEV;
const defaultShikiPaths = isDev ? {
    themes: '/node_modules/shiki/themes/',
    languages: '/node_modules/shiki/languages/',
    wasm: '/node_modules/shiki/dist/'
} : {
    themes: 'https://cdn.jsdelivr.net/npm/shiki@0.14.7/themes/',
    languages: 'https://cdn.jsdelivr.net/npm/shiki@0.14.7/languages/',
    wasm: 'https://cdn.jsdelivr.net/npm/shiki@0.14.7/dist/'
};

let shikiPaths = defaultShikiPaths;

function initShiki() {
    getHighlighter({ theme: 'nord', paths: shikiPaths }).then(highlighter => {
        shikiHighlighter = highlighter;
    }).catch(err => {
        console.warn('Failed to load shiki highlighter', err);
    });
}

initShiki();

export function setShikiPaths(paths) {
    shikiPaths = Object.assign({}, defaultShikiPaths, paths);
    initShiki();
}

export function registerShikiHighlighter(highlighter) {
    shikiHighlighter = highlighter;
}

export function getShikiHighlighter() {
    return shikiHighlighter;
}

// Monaco
export function registerMonaco() {}
export function getMonaco() {
    return window.monaco || monaco;
}

// Highlight.js
export function registerHightLight() {}
export function getHightLight() {
    return window.hljs || hljs;
}

// Prettier
const prettierPlugins = [
    prettierPluginBabel,
    prettierPluginEstree,
    prettierPluginHtml,
    prettierPluginMarkdown,
    prettierPluginPostcss,
    prettierPluginTypescript
];

const prettierObj = {
    ...prettier,
    prettierPlugins
};

export function registerPrettier() {}
export function getPrettier() {
    return window.prettier || prettierObj;
}

// Markmap
const markmapObj = {
    ...markmapCommon,
    ...markmapView,
    ...markmapLib
};

export function registerMarkMap() {}
export function getMarkMap() {
    return window.markmap || markmapObj;
}

// Swiper
export function registerSwiper() {}
export function getSwiper() {
    return window.Swiper || Swiper;
}

// QRCode
export function registerQRCode() {}
export function getQRCode() {
    return window.QRCode || QRCode;
}

// Mermaid
export function registerMermaid() {}
export function getMermaid() {
    return window.mermaid || mermaid;
}

// XLSX
export function registerXLSX() {}
export function getXLSX() {
    return window.XLSX || XLSX;
}

// X_spreadsheet
export function registerX_spreadsheet() {}
export function getX_spreadsheet() {
    return window.x_spreadsheet || X_spreadsheet;
}

// FlowChart
export function registerFlowChart() {}
export function getFlowChart() {
    return window.flowchart || flowchart;
}
