
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
import { createHighlighter } from 'shiki';
import * as markmapCommon from 'markmap-common';
import * as markmapView from 'markmap-view';
import * as markmapLib from 'markmap-lib';

// Shiki initialization
let shikiHighlighter;

function initShiki() {
  createHighlighter({
    themes: ['nord'],
    langs: [
      'javascript', 'typescript', 'html', 'css', 'json', 'markdown', 'vue', 'bash', 'shell',
      'python', 'java', 'c', 'cpp', 'go', 'rust', 'sql', 'yaml', 'xml', 'ini', 'docker', 'dockerfile'
    ]
  }).then((highlighter) => {
    shikiHighlighter = highlighter;
  }).catch((err) => {
    console.warn('Failed to load shiki highlighter', err);
  });
}

initShiki();

export function setShikiPaths(paths) {
    console.warn('setShikiPaths is deprecated in Shiki v1.0+');
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
