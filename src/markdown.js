import 'highlight.js/styles/github.css';
import MarkdownIt from 'markdown-it';
import emojiPlugin from 'markdown-it-emoji';
import markdownAnchor from 'markdown-it-anchor';
import markdownToc from 'markdown-it-toc-done-right';
import { containerPlugin } from './plugins/plugin_container';
import { katexPlugin, katexRender } from './plugins/plugin_katex';
import { mermaidPlugin, mermaidRender } from './plugins/plugin_mermaid';
import { getShikiHighlighter } from './deps';
import { swiperPlugin } from './plugins/plugin_swiper';
import mkkatex from 'markdown-it-katex';
import taskLists from 'markdown-it-task-lists';
import { qrCodePlugin } from './plugins/plugin_qrcode';
import { excelPlugin } from './plugins/plugin_excel';
import mdPlantUML from 'markdown-it-plantuml';
import { imgLazyload } from '@mdit/plugin-img-lazyload';

import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import java from 'highlight.js/lib/languages/java';
import bash from 'highlight.js/lib/languages/bash';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import css from 'highlight.js/lib/languages/css';
import dart from 'highlight.js/lib/languages/dart';
import dos from 'highlight.js/lib/languages/dos';
import glsl from 'highlight.js/lib/languages/glsl';
import go from 'highlight.js/lib/languages/go';
import gradle from 'highlight.js/lib/languages/gradle';
import graphql from 'highlight.js/lib/languages/graphql';
import json from 'highlight.js/lib/languages/json';
import kotlin from 'highlight.js/lib/languages/kotlin';
import latex from 'highlight.js/lib/languages/latex';
import less from 'highlight.js/lib/languages/less';
import markdown from 'highlight.js/lib/languages/markdown';
import matlab from 'highlight.js/lib/languages/matlab';
import nginx from 'highlight.js/lib/languages/nginx';
import objectivec from 'highlight.js/lib/languages/objectivec';
import pgsql from 'highlight.js/lib/languages/pgsql';
import php from 'highlight.js/lib/languages/php';
import powershell from 'highlight.js/lib/languages/powershell';
import python from 'highlight.js/lib/languages/python';
import r from 'highlight.js/lib/languages/r';
import ruby from 'highlight.js/lib/languages/ruby';
import rust from 'highlight.js/lib/languages/rust';
import scss from 'highlight.js/lib/languages/scss';
import shell from 'highlight.js/lib/languages/shell';
import sql from 'highlight.js/lib/languages/sql';
import swift from 'highlight.js/lib/languages/swift';
import typescript from 'highlight.js/lib/languages/typescript';
import vim from 'highlight.js/lib/languages/vim';
import wasm from 'highlight.js/lib/languages/wasm';
import xml from 'highlight.js/lib/languages/xml';
import { flowChartPlugin } from './plugins/plugin_flowchart';

// 统一维护高亮语言列表，避免分散的重复注册语句。
const HIGHLIGHT_LANGUAGES = [
    ['javascript', javascript],
    ['java', java],
    ['bash', bash],
    ['c', c],
    ['cpp', cpp],
    ['csharp', csharp],
    ['css', css],
    ['dart', dart],
    ['dos', dos],
    ['glsl', glsl],
    ['go', go],
    ['gradle', gradle],
    ['graphql', graphql],
    ['json', json],
    ['kotlin', kotlin],
    ['latex', latex],
    ['less', less],
    ['markdown', markdown],
    ['matlab', matlab],
    ['nginx', nginx],
    ['objectivec', objectivec],
    ['pgsql', pgsql],
    ['php', php],
    ['powershell', powershell],
    ['python', python],
    ['r', r],
    ['ruby', ruby],
    ['rust', rust],
    ['scss', scss],
    ['shell', shell],
    ['sql', sql],
    ['swift', swift],
    ['typescript', typescript],
    ['vim', vim],
    ['wasm', wasm],
    ['xml', xml]
];

HIGHLIGHT_LANGUAGES.forEach(([name, parser]) => {
    hljs.registerLanguage(name, parser);
});

const HTML_ESCAPE_TEST_RE = /[&<>"]/;
const HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
const HTML_REPLACEMENTS = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
};

function replaceUnsafeChar(ch) {
    return HTML_REPLACEMENTS[ch];
}

function escapeHtml(str) {
    if (HTML_ESCAPE_TEST_RE.test(str)) {
        return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
    }
    return str;
}

function renderAttrs(token) {
    let i, l, result;
    // if (token.type === 'heading_open') {
    token.attrs = token.attrs || [];
    if (token.map) {
        const [lineNumber] = token.map;
        token.attrs.push(['data-line', lineNumber + 1]);
    }
    // }

    if (!token.attrs) { return ''; }

    result = '';

    for (i = 0, l = token.attrs.length; i < l; i++) {
        result += ' ' + escapeHtml(token.attrs[i][0]) + '="' + escapeHtml(token.attrs[i][1]) + '"';
    }

    return result;
}

export function installPlugins(md) {
    md.use(emojiPlugin, {});
    md.use(markdownAnchor, { level: 1 });
    md.use(markdownToc, {});
    containerPlugin(md, { hasSingleTheme: false });
    katexPlugin(md);
    mermaidPlugin(md);
    swiperPlugin(md);
    flowChartPlugin(md);
    md.use(mkkatex);
    md.use(taskLists);
    md.use(qrCodePlugin);
    md.use(excelPlugin);
    md.use(mdPlantUML);
    md.use(imgLazyload);
    md.renderer.renderAttrs = renderAttrs;
}

export function createMarkdown() {
    const md = MarkdownIt({
        html: true,
        highlight: function (str, lang) {
            lang = lang || '';
            lang = lang.toLowerCase();
            if (lang === 'ketex' || lang === 'katex') {
                return katexRender(str);
            } else if (lang === 'mermaid') {
                return mermaidRender(str);
            }
            // console.log(str);
            const shikiHighlighter = getShikiHighlighter();
            if (shikiHighlighter && shikiHighlighter.codeToHtml) {
                return shikiHighlighter.codeToHtml(str, { lang, theme: 'nord' });
            }
            if (lang && hljs && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(str, { language: lang }).value;
                } catch (__) { }
            }

            return str;
        }
    });
    installPlugins(md);
    return md;
}
