
import * as monaco from 'monaco-editor';
import hljs from 'highlight.js';
import flowchartModule from 'flowchart.js';
import mermaidModule from 'mermaid';

let shikiHighlighter;
let shikiLoadingPromise;
let prettierObj;
let prettierLoadingPromise;
let markmapObj;
let markmapLoadingPromise;
let swiperObj;
let swiperLoadingPromise;
let qrcodeObj;
let qrcodeLoadingPromise;
let mermaidObj;
let mermaidLoadingPromise;
let xlsxObj;
let xlsxLoadingPromise;
let xSpreadsheetObj;
let xSpreadsheetLoadingPromise;
let flowchartObj;
let flowchartLoadingPromise;

function shikiLoader() {
    if (shikiLoadingPromise) {
        return shikiLoadingPromise;
    }
    shikiLoadingPromise = import('shiki').then(({ createHighlighter }) => {
        return createHighlighter({
            themes: ['nord'],
            langs: [
                'javascript', 'typescript', 'html', 'css', 'json', 'markdown', 'vue', 'bash', 'shell',
                'python', 'java', 'c', 'cpp', 'go', 'rust', 'sql', 'yaml', 'xml', 'ini', 'docker', 'dockerfile'
            ]
        });
    }).then((highlighter) => {
        shikiHighlighter = highlighter;
        return highlighter;
    }).catch((err) => {
        shikiLoadingPromise = null;
        console.warn('Failed to load shiki highlighter', err);
        return null;
    });
    return shikiLoadingPromise;
}

function prettierLoader() {
    if (prettierLoadingPromise) {
        return prettierLoadingPromise;
    }
    prettierLoadingPromise = Promise.all([
        import('prettier/standalone'),
        import('prettier/plugins/babel'),
        import('prettier/plugins/estree'),
        import('prettier/plugins/html'),
        import('prettier/plugins/markdown'),
        import('prettier/plugins/postcss'),
        import('prettier/plugins/typescript')
    ]).then((mods) => {
        const [prettier, babel, estree, html, markdown, postcss, typescript] = mods;
        prettierObj = {
            ...prettier,
            prettierPlugins: [babel, estree, html, markdown, postcss, typescript]
        };
        return prettierObj;
    }).catch((err) => {
        prettierLoadingPromise = null;
        console.warn('Failed to load prettier', err);
        return null;
    });
    return prettierLoadingPromise;
}

function markmapLoader() {
    if (markmapLoadingPromise) {
        return markmapLoadingPromise;
    }
    markmapLoadingPromise = Promise.all([
        import('markmap-common'),
        import('markmap-view'),
        import('markmap-lib')
    ]).then((mods) => {
        const [markmapCommon, markmapView, markmapLib] = mods;
        markmapObj = {
            ...markmapCommon,
            ...markmapView,
            ...markmapLib
        };
        return markmapObj;
    }).catch((err) => {
        markmapLoadingPromise = null;
        console.warn('Failed to load markmap', err);
        return null;
    });
    return markmapLoadingPromise;
}

function swiperLoader() {
    if (swiperLoadingPromise) {
        return swiperLoadingPromise;
    }
    swiperLoadingPromise = import('swiper').then((mod) => {
        swiperObj = mod.default || mod;
        return swiperObj;
    }).catch((err) => {
        swiperLoadingPromise = null;
        console.warn('Failed to load swiper', err);
        return null;
    });
    return swiperLoadingPromise;
}

function qrcodeLoader() {
    if (qrcodeLoadingPromise) {
        return qrcodeLoadingPromise;
    }
    qrcodeLoadingPromise = import('qrcode').then((mod) => {
        qrcodeObj = mod.default || mod;
        return qrcodeObj;
    }).catch((err) => {
        qrcodeLoadingPromise = null;
        console.warn('Failed to load qrcode', err);
        return null;
    });
    return qrcodeLoadingPromise;
}

function normalizeMermaid(mod) {
    if (!mod) {
        return null;
    }
    const visited = new Set();
    const queue = [mod];
    while (queue.length) {
        const current = queue.shift();
        if (!current || (typeof current !== 'object' && typeof current !== 'function') || visited.has(current)) {
            continue;
        }
        visited.add(current);
        if (typeof current.initialize === 'function' && typeof current.run === 'function') {
            return current;
        }
        if (current.default) {
            queue.push(current.default);
        }
        if (current.mermaid) {
            queue.push(current.mermaid);
        }
        if (current.mermaidAPI) {
            queue.push(current.mermaidAPI);
        }
    }
    return null;
}

function mermaidLoader() {
    if (mermaidLoadingPromise) {
        return mermaidLoadingPromise;
    }
    mermaidLoadingPromise = import('mermaid').then((mod) => {
        mermaidObj = normalizeMermaid(mod) || normalizeMermaid(window.mermaid) || normalizeMermaid(mermaidModule);
        return mermaidObj;
    }).catch((err) => {
        mermaidLoadingPromise = null;
        console.warn('Failed to load mermaid', err);
        return null;
    });
    return mermaidLoadingPromise;
}

function xlsxLoader() {
    if (xlsxLoadingPromise) {
        return xlsxLoadingPromise;
    }
    xlsxLoadingPromise = import('xlsx').then((mod) => {
        xlsxObj = mod.default || mod;
        return xlsxObj;
    }).catch((err) => {
        xlsxLoadingPromise = null;
        console.warn('Failed to load xlsx', err);
        return null;
    });
    return xlsxLoadingPromise;
}

function xSpreadsheetLoader() {
    if (xSpreadsheetLoadingPromise) {
        return xSpreadsheetLoadingPromise;
    }
    xSpreadsheetLoadingPromise = import('x-data-spreadsheet').then((mod) => {
        xSpreadsheetObj = mod.default || mod;
        return xSpreadsheetObj;
    }).catch((err) => {
        xSpreadsheetLoadingPromise = null;
        console.warn('Failed to load x-data-spreadsheet', err);
        return null;
    });
    return xSpreadsheetLoadingPromise;
}

function normalizeFlowChart(mod) {
    if (!mod) {
        return null;
    }
    const visited = new Set();
    const queue = [mod];
    while (queue.length) {
        const current = queue.shift();
        if (!current || (typeof current !== 'object' && typeof current !== 'function') || visited.has(current)) {
            continue;
        }
        visited.add(current);
        if (typeof current.parse === 'function') {
            return current;
        }
        if (current.default) {
            queue.push(current.default);
        }
        if (current.flowchart) {
            queue.push(current.flowchart);
        }
        if (current.FlowChart) {
            queue.push(current.FlowChart);
        }
    }
    return null;
}

function flowchartLoader() {
    if (flowchartLoadingPromise) {
        return flowchartLoadingPromise;
    }
    flowchartLoadingPromise = import('flowchart.js').then((mod) => {
        flowchartObj = normalizeFlowChart(mod) || normalizeFlowChart(window.flowchart) || normalizeFlowChart(flowchartModule);
        return flowchartObj;
    }).catch((err) => {
        flowchartLoadingPromise = null;
        console.warn('Failed to load flowchart', err);
        return null;
    });
    return flowchartLoadingPromise;
}

export function setShikiPaths(paths) {
    console.warn('setShikiPaths is deprecated in Shiki v1.0+');
}

export function registerShikiHighlighter(highlighter) {
    shikiHighlighter = highlighter;
}

export function getShikiHighlighter() {
    if (!shikiHighlighter) {
        shikiLoader();
    }
    return shikiHighlighter;
}

export function ensureShikiHighlighter() {
    if (shikiHighlighter) {
        return Promise.resolve(shikiHighlighter);
    }
    return shikiLoader();
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

export function registerPrettier(prettier) {
    prettierObj = prettier;
    return prettierObj;
}
export function getPrettier() {
    return window.prettier || prettierObj;
}

export function ensurePrettier() {
    if (window.prettier) {
        return Promise.resolve(window.prettier);
    }
    if (prettierObj) {
        return Promise.resolve(prettierObj);
    }
    return prettierLoader();
}

export function registerMarkMap(markmap) {
    markmapObj = markmap;
    return markmapObj;
}
export function getMarkMap() {
    return window.markmap || markmapObj;
}

export function ensureMarkMap() {
    if (window.markmap) {
        return Promise.resolve(window.markmap);
    }
    if (markmapObj) {
        return Promise.resolve(markmapObj);
    }
    return markmapLoader();
}

// Swiper
export function registerSwiper(swiper) {
    swiperObj = swiper;
    return swiperObj;
}
export function getSwiper() {
    return window.Swiper || swiperObj;
}
export function ensureSwiper() {
    if (window.Swiper) {
        return Promise.resolve(window.Swiper);
    }
    if (swiperObj) {
        return Promise.resolve(swiperObj);
    }
    return swiperLoader();
}

// QRCode
export function registerQRCode(qrcode) {
    qrcodeObj = qrcode;
    return qrcodeObj;
}
export function getQRCode() {
    return window.QRCode || qrcodeObj;
}
export function ensureQRCode() {
    if (window.QRCode) {
        return Promise.resolve(window.QRCode);
    }
    if (qrcodeObj) {
        return Promise.resolve(qrcodeObj);
    }
    return qrcodeLoader();
}

// Mermaid
export function registerMermaid(mermaid) {
    mermaidObj = normalizeMermaid(mermaid);
    return mermaidObj;
}
export function getMermaid() {
    return normalizeMermaid(window.mermaid) || mermaidObj || normalizeMermaid(mermaidModule);
}
export function ensureMermaid() {
    if (window.mermaid) {
        return Promise.resolve(normalizeMermaid(window.mermaid));
    }
    if (mermaidObj) {
        return Promise.resolve(mermaidObj);
    }
    const mermaid = normalizeMermaid(mermaidModule);
    if (mermaid) {
        mermaidObj = mermaid;
        return Promise.resolve(mermaidObj);
    }
    return mermaidLoader();
}

// XLSX
export function registerXLSX(xlsx) {
    xlsxObj = xlsx;
    return xlsxObj;
}
export function getXLSX() {
    return window.XLSX || xlsxObj;
}
export function ensureXLSX() {
    if (window.XLSX) {
        return Promise.resolve(window.XLSX);
    }
    if (xlsxObj) {
        return Promise.resolve(xlsxObj);
    }
    return xlsxLoader();
}

// X_spreadsheet
export function registerX_spreadsheet(xSpreadsheet) {
    xSpreadsheetObj = xSpreadsheet;
    return xSpreadsheetObj;
}
export function getX_spreadsheet() {
    return window.x_spreadsheet || xSpreadsheetObj;
}
export function ensureX_spreadsheet() {
    if (window.x_spreadsheet) {
        return Promise.resolve(window.x_spreadsheet);
    }
    if (xSpreadsheetObj) {
        return Promise.resolve(xSpreadsheetObj);
    }
    return xSpreadsheetLoader();
}

// FlowChart
export function registerFlowChart(flowchart) {
    flowchartObj = normalizeFlowChart(flowchart);
    return flowchartObj;
}
export function getFlowChart() {
    return normalizeFlowChart(window.flowchart) || flowchartObj || normalizeFlowChart(flowchartModule);
}
export function ensureFlowChart() {
    if (window.flowchart) {
        return Promise.resolve(normalizeFlowChart(window.flowchart));
    }
    if (flowchartObj) {
        return Promise.resolve(flowchartObj);
    }
    const flowchart = normalizeFlowChart(flowchartModule);
    if (flowchart) {
        flowchartObj = flowchart;
        return Promise.resolve(flowchartObj);
    }
    return flowchartLoader();
}
